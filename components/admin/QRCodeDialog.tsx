'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
}

export function QRCodeDialog({ open, onOpenChange, eventId, eventTitle }: QRCodeDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate feedback URL
  const feedbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/events/${eventId}/feedback`
    : `/events/${eventId}/feedback`;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Get the SVG element
      const svgElement = document.getElementById(`qr-code-${eventId}`);
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
            a.download = `feedback-qr-${eventId}-${eventTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
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
            Feedback QR Code
          </DialogTitle>
          <DialogDescription>
            Scan this QR code to provide feedback for: <strong>{eventTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
            <QRCodeSVG
              id={`qr-code-${eventId}`}
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
      </DialogContent>
    </Dialog>
  );
}

