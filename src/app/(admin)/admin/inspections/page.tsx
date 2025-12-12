'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Play, Download, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';

interface Inspection {
  id: number;
  created_at: string;
  month: string | null;
  coordinator: string | null;
  bus: number | null;
  pdf: string | null;
  video: string | null;
  code: string | null;
  d_uploaded: string | null;
  video_gp: string | null;
  plate_number: string | null;
  bus_uploaded: string | null;
  issue: string | null;
  both_vid_pdf: string | null;
  inspection_completed_by: string | null;
  issues: string | null;
  bus_rel: {
    id: number;
    bus_code: string | null;
    plate_no: string | null;
  } | null;
}

export default function ViewInspections() {
  const { adminRole } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCoordinator, setFilterCoordinator] = useState<string>('all');

  useEffect(() => {
    fetchInspections();
  }, [selectedMonth]);

  const fetchInspections = async () => {
    try {
      let url = '/api/inspections';
      const params = new URLSearchParams();

      if (selectedMonth) {
        params.append('month', selectedMonth.toISOString().split('T')[0]);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch inspections');
      const data = await res.json();
      setInspections(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch =
      !searchTerm ||
      inspection.bus_rel?.bus_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.bus_rel?.plate_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.coordinator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.plate_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCoordinator =
      filterCoordinator === 'all' ||
      inspection.coordinator === filterCoordinator;

    return matchesSearch && matchesCoordinator;
  });

  const uniqueCoordinators = Array.from(
    new Set(
      inspections
        .map((i) => i.coordinator)
        .filter((c): c is string => c !== null && c !== undefined)
    )
  ).sort();

  const clearMonthFilter = () => {
    setSelectedMonth(undefined);
  };

  const getMonthRange = (date: Date) => {
    return format(date, 'MMMM yyyy');
  };

  if (loading) {
    return (
      <Card className="max-w-7xl mx-auto bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Bus Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="flex justify-between items-center flex-wrap gap-4">
          <span className="text-secondary-foreground text-sm">Bus Inspections</span>
          <div className="flex items-center gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-gray-400 text-sm h-8 px-3">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? getMonthRange(selectedMonth) : 'Filter by Month'}
                  {selectedMonth && (
                    <X
                      className="ml-2 h-4 w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearMonthFilter();
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  selectedDate={selectedMonth}
                  onSelectDate={(date) => {
                    if (date) {
                      setSelectedMonth(date);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
            {selectedMonth && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={clearMonthFilter}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by bus code, plate number, or coordinator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px]"
            />
            <Select value={filterCoordinator} onValueChange={setFilterCoordinator}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by coordinator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coordinators</SelectItem>
                {uniqueCoordinators.map((coord) => (
                  <SelectItem key={coord} value={coord}>
                    {coord}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredInspections.length === 0 ? (
          <p>No inspections found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Coordinator</TableHead>
                  <TableHead>Video</TableHead>
                  <TableHead>Code Audio</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Completed By</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.map((inspection) => (
                  <TableRow key={inspection.id}>
                    <TableCell>{inspection.id}</TableCell>
                    <TableCell>
                      {inspection.month
                        ? format(new Date(inspection.month), 'MMM yyyy')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {inspection.bus_rel?.bus_code || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {inspection.plate_number || inspection.bus_rel?.plate_no || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {inspection.coordinator || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {inspection.video ? (
                        <a
                          href={inspection.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          View Video
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {inspection.code ? (
                        <a
                          href={inspection.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Play Audio
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {inspection.pdf ? (
                        <a
                          href={inspection.pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {inspection.issue && (
                          <p className="text-sm">{inspection.issue}</p>
                        )}
                        {inspection.issues && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {inspection.issues}
                          </p>
                        )}
                        {!inspection.issue && !inspection.issues && 'None'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {inspection.inspection_completed_by || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {inspection.d_uploaded
                        ? format(new Date(inspection.d_uploaded), 'MMM d, yyyy')
                        : inspection.created_at
                        ? format(new Date(inspection.created_at), 'MMM d, yyyy')
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

