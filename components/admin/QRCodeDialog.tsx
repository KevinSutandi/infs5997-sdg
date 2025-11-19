'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
}

type QRCodeType = 'checkin' | 'feedback';

export function QRCodeDialog({ open, onOpenChange, eventId, eventTitle }: QRCodeDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrType, setQrType] = useState<QRCodeType>('checkin');

  // Generate URLs based on type
  const checkInUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${eventId}/checkin`
    : `/events/${eventId}/checkin`;

  const feedbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${eventId}/feedback`
    : `/events/${eventId}/feedback`;

  const currentUrl = qrType === 'checkin' ? checkInUrl : feedbackUrl;
  const qrCodeId = `qr-code-${eventId}-${qrType}`;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Get the SVG element
      const svgElement = document.getElementById(qrCodeId);
      if (!svgElement) {
        toast.error('QR code not found');
        return;
      }

      // Convert SVG to canvas
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Download as PNG
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const typeLabel = qrType === 'checkin' ? 'checkin' : 'feedback';
            a.download = `${typeLabel}-qr-${eventId}-${eventTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('QR code downloaded successfully');
          }
        });
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Event QR Code
          </DialogTitle>
          <DialogDescription>
            Generate QR codes for: <strong>{eventTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={qrType} onValueChange={(value) => setQrType(value as QRCodeType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Check-In
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="space-y-4 mt-4">
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  id={qrCodeId}
                  value={checkInUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-2 w-full">
                <p className="text-sm text-muted-foreground break-all">
                  {checkInUrl}
                </p>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download QR Code'}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Place this QR code at the event entrance for quick check-in. Students can scan to confirm attendance.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4 mt-4">
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <QRCodeSVG
                  id={qrCodeId}
                  value={feedbackUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-2 w-full">
                <p className="text-sm text-muted-foreground break-all">
                  {feedbackUrl}
                </p>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download QR Code'}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Place this QR code on slides, posters, or handouts for easy access to event feedback.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

