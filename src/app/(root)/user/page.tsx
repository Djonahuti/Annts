'use client';

import EventCalendar from '@/components/EventCalender';
import Modal from '@/components/Modal';
import Contact from '@/components/Shared/Contact';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { CheckCircle2, LocateFixed, Mail, RadioTower, SendHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Bus {
  id: number;
  bus_code: string | null;
  plate_no: string | null;
  driver_name: string | null;
  driver_id: number | null;
  driver_phone: string[] | null;
  e_payment: string | null;
}

interface Coordinator {
  id: number;
  name: string;
  email: string;
  phone: string[] | null;
}

interface Payment {
  week: string | null;
  amount: number | null;
  pay_complete: string | null;
}

interface BusPaymentStatus {
  loading: boolean;
  payComplete: boolean;
  dueAmount: string;
}

interface BusInspectionStatus {
  loading: boolean;
  inspectionComplete: boolean;
}

interface Inspection {
  id: number;
  month: string | null;
  bus: number | null;
}

const formatAsNaira = (value: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(value);
};

const getMondayOfCurrentWeek = (): string => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Payment week runs Sunday-Saturday, but week_start is stored as Monday (grace day)
  // If today is Sunday, use tomorrow (Monday) as week_start
  // If today is Monday-Saturday, use the Monday of the current week
  let daysToMonday: number;
  if (day === 0) {
    // Sunday: use tomorrow (Monday) - this is the grace day for the current payment week
    daysToMonday = 1;
  } else {
    // For Monday-Saturday: go back to Monday of current week
    // Monday (1): 0 days back, Tuesday (2): -1 day, etc.
    daysToMonday = 1 - day;
  }
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + daysToMonday);
  monday.setHours(0, 0, 0, 0); // Set to start of day
  
  // Return as YYYY-MM-DD format
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const date = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const getFirstDayOfCurrentMonth = (): string => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
};

export default function UserProfile() {
  const router = useRouter();
  const { user, role, loading: authLoading, signOut } = useAuth();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [coordinator, setCoordinator] = useState<Coordinator | null>(null);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);
  const [busPaymentStatus, setBusPaymentStatus] = useState<Record<number, BusPaymentStatus>>({});
  const [busInspectionStatus, setBusInspectionStatus] = useState<Record<number, BusInspectionStatus>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && (!user || role !== 'coordinator')) {
        router.push('/login');
        return;
      }

      if (authLoading || !user?.email) return;

      try {
        const res = await fetch(`/api/coordinator/buses?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setCoordinator(data.coordinator);
        setBuses(data.buses);
      } catch (err) {
        console.error(err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role, authLoading, router]);

  useEffect(() => {
    if (buses.length === 0) return;

    const mondayDate = getMondayOfCurrentWeek();

    buses.forEach((bus) => {
      setBusPaymentStatus((prev) => ({
        ...prev,
        [bus.id]: prev[bus.id] || { loading: true, payComplete: false, dueAmount: formatAsNaira(0) },
      }));

      const fetchPayments = async () => {
        try {
          // First, fetch the expected payment for the current week
          const expectedRes = await fetch(`/api/buses/${bus.id}/expected-payment?week_start=${mondayDate}`);
          let expectedAmount = 0;
          
          if (expectedRes.ok) {
            const expectedData = await expectedRes.json();
            if (expectedData && expectedData.length > 0 && expectedData[0].amount) {
              expectedAmount = Number(expectedData[0].amount) || 0;
            }
          } else {
            // Log the error but don't throw - we'll fallback to e_payment
            console.warn(`Failed to fetch expected payment for bus ${bus.id}:`, expectedRes.status, expectedRes.statusText);
          }
          
          // If no expected_payment found for this week, fallback to bus.e_payment
          if (expectedAmount === 0) {
            expectedAmount = Number(bus.e_payment) || 0;
          }

          // Then fetch actual payments for this week
          const res = await fetch(`/api/payments?busId=${bus.id}`);
          if (!res.ok) throw new Error('Failed to fetch payments');
          const data: Payment[] = await res.json();

          const weekPayment = data.find((p) => {
            if (!p.week) return false;
            const paymentWeek = typeof p.week === 'string' ? p.week : new Date(p.week).toISOString().split('T')[0];
            return paymentWeek === mondayDate;
          });

          let payComplete = false;
          let dueAmount = expectedAmount;

          if (weekPayment) {
            payComplete = weekPayment.pay_complete === 'YES';
            if (payComplete) {
              dueAmount = 0;
            } else {
              const paid = Number(weekPayment.amount) || 0;
              dueAmount = Math.max(0, expectedAmount - paid);
            }
          }

          setBusPaymentStatus((prev) => ({
            ...prev,
            [bus.id]: { loading: false, payComplete, dueAmount: formatAsNaira(dueAmount) },
          }));
        } catch (error) {
          console.error('Error fetching payment status for bus', bus.id, error);
          // On error, set amount to 0 (don't use e_payment fallback)
          setBusPaymentStatus((prev) => ({
            ...prev,
            [bus.id]: { loading: false, payComplete: false, dueAmount: formatAsNaira(0) },
          }));
        }
      };

      fetchPayments();
    });
  }, [buses]);

  // Check inspection status for current month
  useEffect(() => {
    if (buses.length === 0) return;

    const currentMonth = getFirstDayOfCurrentMonth();

    buses.forEach((bus) => {
      setBusInspectionStatus((prev) => ({
        ...prev,
        [bus.id]: prev[bus.id] || { loading: true, inspectionComplete: false },
      }));

      const fetchInspections = async () => {
        try {
          const res = await fetch(`/api/inspections?busId=${bus.id}&month=${currentMonth}`);
          if (!res.ok) throw new Error('Failed to fetch inspections');
          const data: Inspection[] = await res.json();

          // Check if inspection exists for current month (comparing first day of month)
          const hasInspection = data.some((inspection) => {
            if (!inspection.month) return false;
            const inspectionMonth = typeof inspection.month === 'string' 
              ? inspection.month 
              : new Date(inspection.month).toISOString().split('T')[0];
            // Compare first day of month (stored as first day)
            return inspectionMonth === currentMonth;
          });

          setBusInspectionStatus((prev) => ({
            ...prev,
            [bus.id]: { loading: false, inspectionComplete: hasInspection },
          }));
        } catch (error) {
          console.error('Error fetching inspection status for bus', bus.id, error);
          setBusInspectionStatus((prev) => ({
            ...prev,
            [bus.id]: { loading: false, inspectionComplete: false },
          }));
        }
      };

      fetchInspections();
    });
  }, [buses]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Coordinator Profile</h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, {coordinator?.name || user?.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 flex justify-between md:flex-row flex-col">
          <div className="mr-auto">
            <p>Role: Coordinator</p>
            <p>Email: {coordinator?.email}</p>
            {coordinator?.phone && <p>Phone: {coordinator.phone.join(', ')}</p>}
          </div>
          <div className="space-x-2 space-y-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="border-2 flex-1 border-primary dark:border-primary-light text-primary dark:text-primary-light hover:bg-primary-dark dark:hover:bg-primary-light hover:text-gray-200 dark:hover:text-gray-100">
                  <LocateFixed className="mr-2 h-4 w-4" />
                  Tracker
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="https://monitor.concept-nova.com/objects" target="_blank" rel="noopener noreferrer">
                    Tracker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="https://monitor.autotrack.ng/objects" target="_blank" rel="noopener noreferrer">
                    New Tracker
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="https://sites.google.com/annhurst-gsl.com/portal/home" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-primary text-gray-200 hover:bg-red-50 hover:text-primary">
                <RadioTower className="mr-2 h-4 w-4" />
                Intranet
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Link href="/my-inbox" className="mr-auto">
              <Button className="bg-linear-to-r from-gray-600 to-primary-light text-gray-200 hover:from-primary-dark hover:to-primary-dark transform transition duration-300 ease-in-out hover:scale-105">
                <Mail className="mr-2 h-4 w-4" />
                Inbox
              </Button>
            </Link>
          </div>
          <Button onClick={handleLogout} className="text-gray-200">
            Logout
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buses Under Your Coordination</CardTitle>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <p>No buses assigned to you.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Code</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.bus_code || 'N/A'}</TableCell>
                    <TableCell>{bus.plate_no || 'N/A'}</TableCell>
                    <TableCell>{bus.driver_name || 'N/A'}</TableCell>
                    <TableCell className="space-x-2">
                      {busPaymentStatus[bus.id] && !busPaymentStatus[bus.id].payComplete && (
                        <div className="text-sm text-muted-foreground">
                          {busPaymentStatus[bus.id].loading ? 'Checking current week...' : `Due this week: ${busPaymentStatus[bus.id].dueAmount}`}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/payment/${bus.id}`)}
                        disabled={busPaymentStatus[bus.id]?.payComplete}
                      >
                        {busPaymentStatus[bus.id]?.payComplete ? (
                          <span className="flex items-center space-x-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Payment Uploaded</span>
                          </span>
                        ) : (
                          'Post Payment'
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/payment/${bus.id}/history`)}
                      >
                        View Payments
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/user/inspection/${bus.id}`)}
                        disabled={busInspectionStatus[bus.id]?.inspectionComplete}
                      >
                        {busInspectionStatus[bus.id]?.inspectionComplete ? (
                          <span className="flex items-center space-x-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Inspection Uploaded</span>
                          </span>
                        ) : (
                          'Bus Inspection'
                        )}
                      </Button>
                      <Button
                        className="ml-auto rounded-full"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          // Get the first phone number if available
                          const phoneNumber = bus.driver_phone && bus.driver_phone.length > 0 
                            ? bus.driver_phone[0].replace(/\D/g, '') // Remove non-numeric characters
                            : null;
                          
                          if (phoneNumber) {
                            // Format phone number for WhatsApp (remove leading 0 if present, ensure country code)
                            let formattedPhone = phoneNumber;
                            if (formattedPhone.startsWith('0')) {
                              formattedPhone = '234' + formattedPhone.substring(1);
                            } else if (!formattedPhone.startsWith('234')) {
                              formattedPhone = '234' + formattedPhone;
                            }
                            window.open(`https://wa.me/${formattedPhone}`, '_blank');
                          } else {
                            alert('Driver phone number not available');
                          }
                        }}
                        disabled={!bus.driver_phone || bus.driver_phone.length === 0}
                      >
                        <IconBrandWhatsapp className="h-8 w-8 text-green-500" />
                      </Button>
                      <Button
                        className="ml-auto rounded-full"
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setSelectedDriverId(bus.driver_id);
                          setContactModalOpen(true);
                        }}
                      >
                        <SendHorizontal className="h-8 w-8 text-primary" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-2xl">Next End of the Month Meeting Date</div>
          <EventCalendar />
        </CardFooter>
      </Card>

      <Modal isOpen2={isContactModalOpen} onClose={() => setContactModalOpen(false)}>
        <Contact driverId={selectedDriverId} />
      </Modal>
    </div>
  );
}