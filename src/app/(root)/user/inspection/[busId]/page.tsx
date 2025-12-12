'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import fetchWithAuth from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Video, Mic, X, Play, Pause } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';

interface Bus {
  id: number;
  bus_code: string | null;
  plate_no: string | null;
}

// Zod schema for inspection validation
const inspectionSchema = z.object({
  month: z.date(),
  bus: z.string().min(1, 'Bus is required'),
  plate_number: z.string().optional(),
  video: z.string().min(1, 'Video is required'),
  code: z.string().min(1, 'Code audio recording is required'),
  pdf: z.string().optional(),
  issue: z.string().optional(),
  issues: z.string().optional(),
  inspection_completed_by: z.enum([
    'Cleophas',
    'Emmanuel',
    'Roland',
    'Mukaila',
    'Deborah',
    'David',
    'Adaobi',
  ] as const).optional(),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

export default function NewInspection() {
  const router = useRouter();
  const params = useParams<{ busId: string }>();
  const { busId: routeBusId } = params;
  const { user, role, loading: authLoading } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [busCode, setBusCode] = useState<string>('');

  // Form setup with react-hook-form and zodResolver
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema) as unknown as import('react-hook-form').Resolver<InspectionFormValues>,
    defaultValues: {
      month: startOfMonth(new Date()), // Default to first day of current month
      bus: routeBusId || '',
      plate_number: '',
      video: '',
      code: '',
      pdf: '',
      issue: '',
      issues: '',
      inspection_completed_by: undefined,
    },
  });

  // File uploads
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioUploading, setAudioUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Recording state
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || role !== 'coordinator')) {
      router.push('/login');
      return;
    }

    if (authLoading || !user?.email) return;

    const fetchBuses = async () => {
      try {
        const res = await fetchWithAuth(`/api/coordinator/buses?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error('Failed to fetch buses');
        const data = await res.json();
        setBuses(data.buses || []);
        
        // If busId is provided in route, set it and fetch bus details
        if (routeBusId) {
          const busIdNum = Number(routeBusId);
          const selectedBus = data.buses?.find((b: Bus) => b.id === busIdNum);
          if (selectedBus) {
            form.setValue('bus', routeBusId);
            form.setValue('plate_number', selectedBus.plate_no || '');
            setBusCode(selectedBus.bus_code || `BUS${routeBusId}`);
          } else {
            // Fetch bus details from API
            try {
              const busRes = await fetchWithAuth(`/api/buses/${routeBusId}`);
              if (busRes.ok) {
                const busData = await busRes.json();
                form.setValue('plate_number', busData.plate_no || '');
                setBusCode(busData.bus_code || `BUS${routeBusId}`);
              }
            } catch (err) {
              console.error('Error fetching bus details:', err);
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [user, role, authLoading, router, routeBusId]);

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file size must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setVideoUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');

      const res = await fetchWithAuth('/api/upload-inspection', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Upload failed';
        try {
          const error = await res.json();
          errorMessage = error.error || error.details || 'Upload failed';
        } catch (e) {
          // If response is not JSON (might be HTML error page)
          if (res.status === 413) {
            errorMessage = 'File too large. Server needs configuration update for larger files.';
          } else {
            errorMessage = `Upload failed with status ${res.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const videoUrlValue = data.url;
      setVideoUrl(videoUrlValue);
      form.setValue('video', videoUrlValue);
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload video');
      setVideoFile(null);
    } finally {
      setVideoUploading(false);
    }
  };

  const handleAudioFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Audio file size must be less than 50MB');
      return;
    }

    setAudioFile(file);
    setAudioUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');

      const res = await fetchWithAuth('/api/upload-inspection', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Upload failed';
        try {
          const error = await res.json();
          errorMessage = error.error || error.details || 'Upload failed';
        } catch (e) {
          // If response is not JSON (might be HTML error page)
          if (res.status === 413) {
            errorMessage = 'File too large. Server needs configuration update for larger files.';
          } else {
            errorMessage = `Upload failed with status ${res.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const audioUrlValue = data.url;
      setAudioUrl(audioUrlValue);
      form.setValue('code', audioUrlValue);
      toast.success('Audio uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload audio');
      setAudioFile(null);
    } finally {
      setAudioUploading(false);
    }
  };

  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    setPdfFile(file);
    setPdfUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetchWithAuth('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = 'Upload failed';
        try {
          const error = await res.json();
          errorMessage = error.error || error.details || 'Upload failed';
        } catch (e) {
          // If response is not JSON (might be HTML error page)
          if (res.status === 413) {
            errorMessage = 'File too large. Server needs configuration update for larger files.';
          } else {
            errorMessage = `Upload failed with status ${res.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const pdfUrlValue = data.url;
      setPdfUrl(pdfUrlValue);
      form.setValue('pdf', pdfUrlValue);
      toast.success('PDF uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload PDF');
      setPdfFile(null);
    } finally {
      setPdfUploading(false);
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoStreamRef.current = stream;

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Configure MediaRecorder with lower quality to reduce file size
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 2500000, // 2.5 Mbps - lower quality, smaller files
      };
      
      // Fallback to default if codec not supported
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `inspection-video-${Date.now()}.webm`, { type: 'video/webm' });
        
        setVideoFile(file);
        setVideoUploading(true);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'video');

          const res = await fetchWithAuth('/api/upload-inspection', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Upload failed');
          }

          const data = await res.json();
          const videoUrlValue = data.url;
          setVideoUrl(videoUrlValue);
          form.setValue('video', videoUrlValue);
          toast.success('Video recorded and uploaded successfully');
        } catch (error) {
          console.error(error);
          toast.error(error instanceof Error ? error.message : 'Failed to upload video');
          setVideoFile(null);
        } finally {
          setVideoUploading(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVideo(true);
    } catch (error) {
      console.error('Error starting video recording:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecordingVideo) {
      mediaRecorderRef.current.stop();
      setIsRecordingVideo(false);
    }
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Configure MediaRecorder with lower quality to reduce file size
      const options: MediaRecorderOptions = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 64000, // 64 kbps - good quality for voice, smaller files
      };
      
      // Fallback to default if codec not supported
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
        mediaRecorder = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], `inspection-code-${Date.now()}.webm`, { type: 'audio/webm' });
        
        setAudioFile(file);
        setAudioUploading(true);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', 'audio');

          const res = await fetchWithAuth('/api/upload-inspection', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            let errorMessage = 'Upload failed';
            try {
              const error = await res.json();
              errorMessage = error.error || error.details || 'Upload failed';
            } catch (e) {
              if (res.status === 413) {
                errorMessage = 'File too large. Server needs configuration update for larger files.';
              } else {
                errorMessage = `Upload failed with status ${res.status}`;
              }
            }
            throw new Error(errorMessage);
          }

          const data = await res.json();
          const audioUrlValue = data.url;
          setAudioUrl(audioUrlValue);
          form.setValue('code', audioUrlValue);
          toast.success('Audio recorded and uploaded successfully');
        } catch (error) {
          console.error(error);
          toast.error(error instanceof Error ? error.message : 'Failed to upload audio');
          setAudioFile(null);
        } finally {
          setAudioUploading(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const onSubmit = async (values: InspectionFormValues) => {
    const busIdNumber = Number(values.bus);
    if (!Number.isFinite(busIdNumber)) {
      toast.error('Invalid bus selected.');
      return;
    }

    try {
      const selectedBus = buses.find((b) => b.id.toString() === values.bus);
      const bothVidPdf = values.video && values.pdf ? 'YES' : 'NO';

      // Ensure month is always the first day of the month
      const monthDate = startOfMonth(values.month);
      const monthIsoString = monthDate.toISOString();

      const res = await fetchWithAuth('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: monthIsoString,
          bus: busIdNumber,
          pdf: values.pdf || null,
          video: values.video,
          code: values.code,
          plate_number: values.plate_number || selectedBus?.plate_no || null,
          issue: values.issue || null,
          issues: values.issues || null,
          inspection_completed_by: values.inspection_completed_by || null,
          both_vid_pdf: bothVidPdf,
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to submit inspection';
        try {
          const error = await res.json();
          errorMessage = error.details || error.error || 'Failed to submit inspection';
        } catch (e) {
          errorMessage = `Failed to submit inspection (status ${res.status})`;
        }
        throw new Error(errorMessage);
      }

      toast.success('Inspection submitted successfully');
      router.push('/user');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit inspection');
    }
  };

  if (loading || authLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>New Inspection{routeBusId ? ` - ${busCode}` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Monthly Bus Inspection{routeBusId ? ` - ${busCode}` : ''}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Month Selection */}
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspection Month *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'MMMM yyyy') : 'Select month'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <MonthYearPicker
                        selectedDate={field.value}
                        onSelectDate={(date) => {
                          // Always set to first day of selected month
                          field.onChange(startOfMonth(date));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bus Selection */}
            <FormField
              control={form.control}
              name="bus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!!routeBusId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bus" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buses.map((bus) => (
                        <SelectItem key={bus.id} value={bus.id.toString()}>
                          {bus.bus_code} ({bus.plate_no})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {routeBusId && (
                    <p className="text-sm text-muted-foreground">
                      Bus pre-selected from route
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plate Number */}
            <FormField
              control={form.control}
              name="plate_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plate Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter plate number"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload */}
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Inspection Video *</FormLabel>
                  <div className="space-y-2">
                    {!field.value ? (
                      <>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={isRecordingVideo ? stopVideoRecording : startVideoRecording}
                            disabled={videoUploading}
                          >
                            {isRecordingVideo ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Video className="mr-2 h-4 w-4" />
                                Record Video
                              </>
                            )}
                          </Button>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            disabled={videoUploading || isRecordingVideo}
                            className="flex-1"
                          />
                        </div>
                        {isRecordingVideo && (
                          <video
                            ref={videoPreviewRef}
                            autoPlay
                            muted
                            className="w-full h-48 bg-black rounded"
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="flex-1">Video uploaded: {field.value}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setVideoUrl(null);
                            setVideoFile(null);
                            field.onChange('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {videoUploading && <p className="text-sm text-muted-foreground">Uploading video...</p>}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Audio Recording (Code) */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Voice Recording *</FormLabel>
                  <div className="space-y-2">
                    {!field.value ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={isRecordingAudio ? stopAudioRecording : startAudioRecording}
                          disabled={audioUploading}
                        >
                          {isRecordingAudio ? (
                            <>
                              <Pause className="mr-2 h-4 w-4" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="mr-2 h-4 w-4" />
                              Record Code
                            </>
                          )}
                        </Button>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileChange}
                          disabled={audioUploading || isRecordingAudio}
                          className="flex-1"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="flex-1">Audio uploaded: {field.value}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAudioUrl(null);
                            setAudioFile(null);
                            field.onChange('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {audioUploading && <p className="text-sm text-muted-foreground">Uploading audio...</p>}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PDF Upload */}
            <FormField
              control={form.control}
              name="pdf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PDF Document (Optional)</FormLabel>
                  <div className="space-y-2">
                    {!field.value ? (
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfFileChange}
                        disabled={pdfUploading}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <span className="flex-1">PDF uploaded: {field.value}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPdfUrl(null);
                            setPdfFile(null);
                            field.onChange('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {pdfUploading && <p className="text-sm text-muted-foreground">Uploading PDF...</p>}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue */}
            <FormField
              control={form.control}
              name="issue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter any issues"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issues (Detailed) */}
            <FormField
              control={form.control}
              name="issues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Issues</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed issues if any"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inspection Completed By */}
            <FormField
              control={form.control}
              name="inspection_completed_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspection Completed By</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cleophas">Cleophas</SelectItem>
                      <SelectItem value="Emmanuel">Emmanuel</SelectItem>
                      <SelectItem value="Roland">Roland</SelectItem>
                      <SelectItem value="Mukaila">Mukaila</SelectItem>
                      <SelectItem value="Deborah">Deborah</SelectItem>
                      <SelectItem value="David">David</SelectItem>
                      <SelectItem value="Adaobi">Adaobi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/user')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Inspection'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

