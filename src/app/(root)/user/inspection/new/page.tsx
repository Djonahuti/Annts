'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import fetchWithAuth from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Video, Mic, X, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';

interface Bus {
  id: number;
  bus_code: string | null;
  plate_no: string | null;
}

export default function NewInspection() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [busId, setBusId] = useState<string>('');
  const [plateNumber, setPlateNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [issues, setIssues] = useState('');
  const [inspectionCompletedBy, setInspectionCompletedBy] = useState('');

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
      } catch (err) {
        console.error(err);
        toast.error('Failed to load buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [user, role, authLoading, router]);

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
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setVideoUrl(data.url);
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
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setAudioUrl(data.url);
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
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setPdfUrl(data.url);
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

      const mediaRecorder = new MediaRecorder(stream);
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
          setVideoUrl(data.url);
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

      const mediaRecorder = new MediaRecorder(stream);
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
            const error = await res.json();
            throw new Error(error.error || 'Upload failed');
          }

          const data = await res.json();
          setAudioUrl(data.url);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!month || !busId) {
      toast.error('Please select month and bus');
      return;
    }

    if (!videoUrl) {
      toast.error('Please upload or record a video');
      return;
    }

    if (!audioUrl) {
      toast.error('Please upload or record the code audio');
      return;
    }

    setSubmitting(true);

    try {
      const selectedBus = buses.find((b) => b.id.toString() === busId);
      const bothVidPdf = videoUrl && pdfUrl ? 'YES' : 'NO';

      const res = await fetchWithAuth('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: month.toISOString().split('T')[0],
          bus: busId,
          pdf: pdfUrl,
          video: videoUrl,
          code: audioUrl,
          plate_number: plateNumber || selectedBus?.plate_no || null,
          issue: issue || null,
          issues: issues || null,
          inspection_completed_by: inspectionCompletedBy || null,
          both_vid_pdf: bothVidPdf,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit inspection');
      }

      toast.success('Inspection submitted successfully');
      router.push('/user');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit inspection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>New Inspection</CardTitle>
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
        <CardTitle>Submit Monthly Bus Inspection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Month Selection */}
          <div className="space-y-2">
            <Label htmlFor="month">Inspection Month *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {month ? format(month, 'PPP') : 'Select month'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  selectedDate={month}
                  onSelectDate={setMonth}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Bus Selection */}
          <div className="space-y-2">
            <Label htmlFor="bus">Bus *</Label>
            <Select value={busId} onValueChange={setBusId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a bus" />
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id.toString()}>
                    {bus.bus_code} ({bus.plate_no})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plate Number */}
          <div className="space-y-2">
            <Label htmlFor="plateNumber">Plate Number</Label>
            <Input
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter plate number"
            />
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <Label>Bus Inspection Video *</Label>
            <div className="space-y-2">
              {!videoUrl ? (
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
                  <span className="flex-1">Video uploaded: {videoUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setVideoUrl(null);
                      setVideoFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {videoUploading && <p className="text-sm text-muted-foreground">Uploading video...</p>}
            </div>
          </div>

          {/* Audio Recording (Code) */}
          <div className="space-y-2">
            <Label>Code Voice Recording *</Label>
            <div className="space-y-2">
              {!audioUrl ? (
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
                  <span className="flex-1">Audio uploaded: {audioUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAudioUrl(null);
                      setAudioFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {audioUploading && <p className="text-sm text-muted-foreground">Uploading audio...</p>}
            </div>
          </div>

          {/* PDF Upload */}
          <div className="space-y-2">
            <Label>PDF Document (Optional)</Label>
            <div className="space-y-2">
              {!pdfUrl ? (
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfFileChange}
                  disabled={pdfUploading}
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span className="flex-1">PDF uploaded: {pdfUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPdfUrl(null);
                      setPdfFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {pdfUploading && <p className="text-sm text-muted-foreground">Uploading PDF...</p>}
            </div>
          </div>

          {/* Issue */}
          <div className="space-y-2">
            <Label htmlFor="issue">Issue</Label>
            <Input
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Enter any issues"
            />
          </div>

          {/* Issues (Detailed) */}
          <div className="space-y-2">
            <Label htmlFor="issues">Detailed Issues</Label>
            <Textarea
              id="issues"
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="Enter detailed issues if any"
              rows={4}
            />
          </div>

          {/* Inspection Completed By */}
          <div className="space-y-2">
            <Label htmlFor="completedBy">Inspection Completed By</Label>
            <Input
              id="completedBy"
              value={inspectionCompletedBy}
              onChange={(e) => setInspectionCompletedBy(e.target.value)}
              placeholder="Enter name of person who completed inspection"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/user')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Inspection'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

