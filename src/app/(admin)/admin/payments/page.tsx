'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { startOfWeek, endOfWeek, isSameWeek, format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'

interface Payment {
  id: number;
  amount: number | null;
  pay_type: string | null;
  pay_complete: string | null;
  bus: {
    id: number;
    bus_code: string;
    plate_no: string;
    e_payment: number | null;  // ← allow null
  } | null;
  coordinator: string | null;
  created_at: string;
}

export default function ViewPayments() {
  const { adminRole } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([])
  const canEdit = adminRole === 'admin' || adminRole === 'editor';
  const canDelete = adminRole === 'admin';
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<Date | undefined>(undefined)
  const [popoverOpen, setPopoverOpen] = useState(false)

  // -------------------------------------------------
  // FETCH PAYMENTS
  // -------------------------------------------------
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('/api/payments');
        if (!res.ok) throw new Error('Failed to fetch payments');
        const data = await res.json();
        setPayments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // -------------------------------------------------
  // UPDATE EXPECTED PAYMENT
  // -------------------------------------------------
  const updateExpectedPayment = async (busId: number | null, value: number) => {
    if (!busId) return;
    try {
      await fetch(`/api/buses/${busId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ e_payment: value }),
      });
      // Optimistically update UI
      setPayments((prev) =>
        prev.map((p) =>
          p.bus?.id === busId
            ? { ...p, bus: { ...p.bus!, e_payment: value } }
            : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------
  // UPDATE PAYMENT STATUS
  // -------------------------------------------------
  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pay_complete: status }),
      });
      // Optimistically update UI
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, pay_complete: status } : p))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const deletePayment = async (paymentId: number) => {
    if (!canDelete) return;
    const confirmed = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to delete payment');
        return;
      }
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
    } catch (e) {
      console.error(e);
      alert('Failed to delete payment');
    }
  };

  // -------------------------------------------------
  // FILTER PAYMENTS BY WEEK
  // -------------------------------------------------
  const filteredPayments = selectedWeek
    ? payments.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        return isSameWeek(paymentDate, selectedWeek, { weekStartsOn: 1 });
      })
    : payments;

  const handleWeekSelect = (date: Date) => {
    setSelectedWeek(date);
    setPopoverOpen(false);
  };

  const clearFilter = () => {
    setSelectedWeek(undefined);
  };

  const getWeekRange = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  };

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  if (loading) {
    return (
      <Card className="max-w-5xl mx-auto bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const displayPayments = loading ? [] : filteredPayments;

  return (
    <Card className="max-w-5xl mx-auto bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-secondary-foreground text-sm">Payments</span>
          <div className="flex items-center gap-2">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-400 text-sm h-8 px-3"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedWeek ? getWeekRange(selectedWeek) : 'Select Week'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  selectedDate={selectedWeek}
                  onSelectDate={handleWeekSelect}
                />
              </PopoverContent>
            </Popover>
            {selectedWeek && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={clearFilter}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : displayPayments.length === 0 ? (
          <p>No payments found{selectedWeek ? ' for the selected week' : ''}.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Bus</TableHead>
                <TableHead>Coordinator</TableHead>
                <TableHead>Expected Amount</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.bus?.bus_code} ({p.bus?.plate_no})</TableCell>
                  <TableCell>{p.coordinator || 'N/A'}</TableCell>

                  {/* ✅ Editable Expected Payment */}
                  <TableCell>
                    <Input
                      type="number"
                      disabled={!canEdit}
                      defaultValue={p.bus?.e_payment ?? 0}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val) && p.bus?.id != null) {
                          updateExpectedPayment(p.bus.id, val);
                        }
                      }}
                      className="border rounded px-2 py-1 w-24"
                    />
                  </TableCell>

                  <TableCell>₦{p.amount?.toLocaleString() || 0}</TableCell>
                  <TableCell>{p.pay_type || 'N/A'}</TableCell>

                  {/* ✅ Editable Pay Status */}
                  <TableCell>
                   {adminRole !== "viewer" ? ( 
                    <Select
                    defaultValue={p.pay_complete || 'Pending'}
                    onValueChange={(status) => updatePaymentStatus(p.id, status)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={p.pay_complete} />
                      </SelectTrigger>
                      <SelectContent className="border rounded px-2 py-1">
                        <SelectItem
                         value="YES"
                         className='data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200'
                        >
                          YES
                        </SelectItem>
                        <SelectItem
                         value="INCOMPLETE"
                         className='data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200'
                        >
                          INCOMPLETE
                        </SelectItem>
                        <SelectItem
                         value="Pending"
                         className='data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200'
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                         value="NO"
                         className='data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200'
                        >
                          NO
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    ) : (
                      <Input
                        disabled
                        type="text"
                        placeholder={p.pay_complete ?? undefined}
                        className='border rounded px-2 py-1 w-20'
                      />
                    )}
                  </TableCell>

                  <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {canDelete ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePayment(p.id)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
