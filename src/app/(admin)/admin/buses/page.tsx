'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Edit2, Filter, RefreshCcw } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

interface Bus {
  id: number;
  bus_code: string | null;
  plate_no: string | null;
  driver_id: number | null;
  driver_name: string | null;
  driver_email: string | null;
  coordinator_id: number | null;
  coordinator_name: string | null;
  coordinator_email: string | null;
  coordinator_phone: string[];
  contract_date: string | null;
  agreed_date: string | null;
  date_collected: string | null;
  start_date: string | null;
  first_pay: string | null;
  e_payment: string | null;
  initial_owe: string | null;
  deposited: string | null;
  t_income: string | null;
  letter: boolean | null;
  status?: string; // Most recent status from bus_status_history
}

interface ExpectedPayment {
  id: number;
  bus: number;
  week_start: string;
  amount: number;
  reason: string | null;
}

interface DriverOption {
  id: number;
  name: string | null;
  email: string | null;
}

interface CoordinatorOption {
  id: number;
  name: string;
  email: string;
}

const busSchema = z.object({
  bus_code: z.string().min(1, 'Bus code is required'),
  plate_no: z.string().min(1, 'Plate number is required'),
  driverId: z.string().optional(),
  coordinatorId: z.string().optional(),
  // store as raw string; we map special sentinel values in the component
  letter: z.string().optional(),
  e_payment: z.string().optional(),
  initial_owe: z.string().optional(),
  deposited: z.string().optional(),
  t_income: z.string().optional(),
  contract_date: z.string().optional(),
  agreed_date: z.string().optional(),
  date_collected: z.string().optional(),
  start_date: z.string().optional(),
  first_pay: z.string().optional(),
});

type BusFormValues = z.infer<typeof busSchema>;

const statusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  note: z.string().optional(),
});

type StatusFormValues = z.infer<typeof statusSchema>;

const expectedPaymentSchema = z.object({
  week_start: z.string().min(1, 'Week start date is required'),
  amount: z.string().min(1, 'Amount is required'),
  reason: z.string().optional(),
});

type ExpectedPaymentFormValues = z.infer<typeof expectedPaymentSchema>;

const formatCurrency = (value: string | null) => {
  if (!value) return '—';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(value));
};

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : '—');

const getBusStatus = (bus: Bus) => {
  // Use status from bus_status_history if available, otherwise default to "Active"
  return bus.status || 'Active';
};

export default function AdminBusesPage() {
  const { user } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [coordinators, setCoordinators] = useState<CoordinatorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCoordinator, setFilterCoordinator] = useState<string>('all');
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  
  // Status history dialog
  const [statusBus, setStatusBus] = useState<Bus | null>(null);
  const [isStatusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isSubmittingStatus, setSubmittingStatus] = useState(false);
  
  // Expected payment dialog
  const [expectedPaymentBus, setExpectedPaymentBus] = useState<Bus | null>(null);
  const [isExpectedPaymentDialogOpen, setExpectedPaymentDialogOpen] = useState(false);
  const [isSubmittingExpectedPayment, setSubmittingExpectedPayment] = useState(false);
  
  // Expected payments map (bus ID -> current expected payment amount)
  const [expectedPayments, setExpectedPayments] = useState<Record<number, number>>({});

  const NONE_VALUE = '__none__';
  const LETTER_NONE_VALUE = '__letter_none__';

  const form = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      bus_code: '',
      plate_no: '',
      driverId: NONE_VALUE,
      coordinatorId: NONE_VALUE,
      letter: LETTER_NONE_VALUE,
      e_payment: '',
      initial_owe: '',
      deposited: '',
      t_income: '',
      contract_date: '',
      agreed_date: '',
      date_collected: '',
      start_date: '',
      first_pay: '',
    },
  });

  // Relax generics for the UI layer – validation is still handled by Zod.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formAny = form as any;

  const statusForm = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: '',
      note: '',
    },
  });

  const expectedPaymentForm = useForm<ExpectedPaymentFormValues>({
    resolver: zodResolver(expectedPaymentSchema),
    defaultValues: {
      week_start: '',
      amount: '',
      reason: '',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusFormAny = statusForm as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expectedPaymentFormAny = expectedPaymentForm as any;

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/buses');
      if (!res.ok) throw new Error('Failed to fetch buses');
      const data = await res.json();
      setBuses(data);
      
      // Fetch expected payments for all buses
      const paymentsMap: Record<number, number> = {};
      await Promise.all(
        data.map(async (bus: Bus) => {
          try {
            const paymentRes = await fetch(`/api/buses/${bus.id}/expected-payment?current=true`);
            if (paymentRes.ok) {
              const payments = await paymentRes.json();
              if (payments.length > 0) {
                paymentsMap[bus.id] = payments[0].amount;
              }
            }
          } catch (error) {
            console.error(`Failed to fetch expected payment for bus ${bus.id}:`, error);
          }
        })
      );
      setExpectedPayments(paymentsMap);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load buses');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const res = await fetch('/api/drivers');
      if (!res.ok) throw new Error('Failed to fetch drivers');
      const data = await res.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCoordinators = useCallback(async () => {
    try {
      const res = await fetch('/api/coordinators');
      if (!res.ok) throw new Error('Failed to fetch coordinators');
      const data = await res.json();
      setCoordinators(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBuses();
    fetchDrivers();
    fetchCoordinators();
  }, [fetchBuses, fetchDrivers, fetchCoordinators]);

  const filteredBuses = useMemo(() => {
    const filtered = buses.filter((bus) => {
      const matchesCoordinator =
        filterCoordinator === 'all' ||
        String(bus.coordinator_id ?? 'none') === filterCoordinator;
      const status = getBusStatus(bus).toLowerCase();
      const matchesStatus =
        filterStatus === 'all' || status === filterStatus;
      return matchesCoordinator && matchesStatus;
    });
    
    // Sort by bus_code alphabetically (nulls last)
    return filtered.sort((a, b) => {
      if (!a.bus_code && !b.bus_code) return 0;
      if (!a.bus_code) return 1;
      if (!b.bus_code) return -1;
      return a.bus_code.localeCompare(b.bus_code);
    });
  }, [buses, filterCoordinator, filterStatus]);

  const handleEdit = (bus: Bus) => {
    setEditingBus(bus);
    setDialogOpen(true);
    form.reset({
      bus_code: bus.bus_code ?? '',
      plate_no: bus.plate_no ?? '',
      driverId: bus.driver_id ? String(bus.driver_id) : NONE_VALUE,
      coordinatorId: bus.coordinator_id ? String(bus.coordinator_id) : NONE_VALUE,
      letter:
        bus.letter === null
          ? LETTER_NONE_VALUE
          : bus.letter
            ? 'true'
            : 'false',
      e_payment: bus.e_payment ?? '',
      initial_owe: bus.initial_owe ?? '',
      deposited: bus.deposited ?? '',
      t_income: bus.t_income ?? '',
      contract_date: bus.contract_date ?? '',
      agreed_date: bus.agreed_date ?? '',
      date_collected: bus.date_collected ?? '',
      start_date: bus.start_date ?? '',
      first_pay: bus.first_pay ?? '',
    });
  };

  const onSubmit = async (values: BusFormValues) => {
    if (!editingBus) return;
    setSubmitting(true);
    const payload = {
      bus_code: values.bus_code,
      plate_no: values.plate_no,
      driver: values.driverId === NONE_VALUE ? null : values.driverId,
      coordinator: values.coordinatorId === NONE_VALUE ? null : values.coordinatorId,
      letter:
        values.letter === LETTER_NONE_VALUE
          ? null
          : values.letter === 'true',
      e_payment: values.e_payment || null,
      initial_owe: values.initial_owe || null,
      deposited: values.deposited || null,
      t_income: values.t_income || null,
      contract_date: values.contract_date || null,
      agreed_date: values.agreed_date || null,
      date_collected: values.date_collected || null,
      start_date: values.start_date || null,
      first_pay: values.first_pay || null,
    };

    try {
      const res = await fetch(`/api/buses/${editingBus.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update bus');

      toast.success('Bus updated');
      setDialogOpen(false);
      setEditingBus(null);
      fetchBuses();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update bus');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusClick = (bus: Bus) => {
    setStatusBus(bus);
    setStatusDialogOpen(true);
    statusForm.reset({
      status: getBusStatus(bus),
      note: '',
    });
  };

  const onSubmitStatus = async (values: StatusFormValues) => {
    if (!statusBus) return;
    setSubmittingStatus(true);

    try {
      const res = await fetch(`/api/buses/${statusBus.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: values.status,
          note: values.note || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update status');
      }

      toast.success('Status updated');
      setStatusDialogOpen(false);
      setStatusBus(null);
      fetchBuses();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const handleExpectedPaymentClick = (bus: Bus) => {
    setExpectedPaymentBus(bus);
    setExpectedPaymentDialogOpen(true);
    expectedPaymentForm.reset({
      week_start: '',
      amount: expectedPayments[bus.id]?.toString() || '',
      reason: '',
    });
  };

  const onSubmitExpectedPayment = async (values: ExpectedPaymentFormValues) => {
    if (!expectedPaymentBus) return;
    setSubmittingExpectedPayment(true);

    try {
      const res = await fetch(`/api/buses/${expectedPaymentBus.id}/expected-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week_start: values.week_start,
          amount: values.amount,
          reason: values.reason || null,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update expected payment');
      }

      toast.success('Expected payment updated');
      setExpectedPaymentDialogOpen(false);
      setExpectedPaymentBus(null);
      fetchBuses();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to update expected payment');
    } finally {
      setSubmittingExpectedPayment(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <Card className="bg-white dark:bg-gray-900">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl font-semibold">Buses</CardTitle>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3" /> All statuses
                    </div>
                  </SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="repossessed">Repossessed</SelectItem>
                  <SelectItem value="to be repossessed">To be Repossessed</SelectItem>
                  <SelectItem value="legal issues">Legal Issues</SelectItem>
                  <SelectItem value="letter issued">Letter Issued</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterCoordinator}
                onValueChange={(value) => setFilterCoordinator(value)}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Filter by coordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All coordinators</SelectItem>
                  {coordinators.map((coordinator) => (
                    <SelectItem key={coordinator.id} value={String(coordinator.id)}>
                      {coordinator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={fetchBuses}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus Code</TableHead>
                <TableHead>Plate No</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Regular Expected Payment</TableHead>
                <TableHead>Contract Date</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Letter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    Loading buses...
                  </TableCell>
                </TableRow>
              ) : filteredBuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-10">
                    No buses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBuses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell className="font-medium">{bus.bus_code ?? '—'}</TableCell>
                    <TableCell>{bus.plate_no ?? '—'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{bus.driver_name ?? 'Unassigned'}</p>
                        {bus.driver_email && (
                          <p className="text-xs text-muted-foreground">{bus.driver_email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{bus.coordinator_name ?? 'N/A'}</p>
                        {bus.coordinator_email && (
                          <p className="text-xs text-muted-foreground">{bus.coordinator_email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(bus.e_payment)}</TableCell>
                    <TableCell>{formatDate(bus.contract_date)}</TableCell>
                    <TableCell>{formatDate(bus.start_date)}</TableCell>
                    <TableCell>{bus.letter ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handleStatusClick(bus)}
                      >
                        {getBusStatus(bus)}
                      </Badge>
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleExpectedPaymentClick(bus)}
                    >
                      {expectedPayments[bus.id] 
                        ? formatCurrency(expectedPayments[bus.id].toString())
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(bus)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setEditingBus(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bus</DialogTitle>
          </DialogHeader>

          <Form {...formAny}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={formAny.control}
                  name="bus_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bus code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. K07" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="plate_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plate number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter plate number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="driverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign driver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-56 overflow-y-auto">
                          <SelectItem value={NONE_VALUE}>Unassigned</SelectItem>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={String(driver.id)}>
                              {driver.name ?? 'Unnamed'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="coordinatorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordinator</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign coordinator" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-w-56 overflow-y-auto">
                          <SelectItem value={NONE_VALUE}>Unassigned</SelectItem>
                          {coordinators.map((coordinator) => (
                            <SelectItem key={coordinator.id} value={String(coordinator.id)}>
                              {coordinator.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={formAny.control}
                  name="letter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Letter issued</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={LETTER_NONE_VALUE}>Not set</SelectItem>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="e_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Expected Payment</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="₦" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="initial_owe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial amount owed</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="deposited"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposited</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="t_income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total income</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={formAny.control}
                  name="contract_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="agreed_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agreed completion</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="date_collected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date collected</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formAny.control}
                  name="first_pay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First payment</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Save changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Status History Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={(open) => {
        setStatusDialogOpen(open);
        if (!open) {
          setStatusBus(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Bus Status</DialogTitle>
          </DialogHeader>

          <Form {...statusFormAny}>
            <form onSubmit={statusForm.handleSubmit(onSubmitStatus)} className="space-y-4">
              <FormField
                control={statusFormAny.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Repossessed">Repossessed</SelectItem>
                        <SelectItem value="To be Repossessed">To be Repossessed</SelectItem>
                        <SelectItem value="Legal Issues">Legal Issues</SelectItem>
                        <SelectItem value="Letter Issued">Letter Issued</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={statusFormAny.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a note about this status change..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground">
                Changed by: {user?.email || 'Current admin'}
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmittingStatus}>
                  {isSubmittingStatus ? 'Saving...' : 'Save Status'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Expected Payment Dialog */}
      <Dialog open={isExpectedPaymentDialogOpen} onOpenChange={(open) => {
        setExpectedPaymentDialogOpen(open);
        if (!open) {
          setExpectedPaymentBus(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Expected Payment</DialogTitle>
          </DialogHeader>

          <Form {...expectedPaymentFormAny}>
            <form onSubmit={expectedPaymentForm.handleSubmit(onSubmitExpectedPayment)} className="space-y-4">
              <FormField
                control={expectedPaymentFormAny.control}
                name="week_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week Start (Monday)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={expectedPaymentFormAny.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₦)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={expectedPaymentFormAny.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a reason for this expected payment..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isSubmittingExpectedPayment}>
                  {isSubmittingExpectedPayment ? 'Saving...' : 'Save Payment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}