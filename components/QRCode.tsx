'use client';

import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value?: string;
  size?: number;
}

export function QRCode({ value, size = 120 }: QRCodeProps) {
  // Generate a random QR code value if none provided
  const qrValue = useMemo(() => {
    if (value) return value;
    
    // Generate a random voucher/reward code
    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `VOUCHER-${randomId}-${timestamp}`.toUpperCase();
  }, [value]);

  return (
    <div className="inline-block">
      <div className="bg-white p-2 rounded border-2 border-border">
        <QRCodeSVG
          value={qrValue}
          size={size}
          level="H"
          includeMargin={true}
        />
      </div>
      <div className="text-[8px] text-center mt-1 text-muted-foreground truncate max-w-full">
        {qrValue}
      </div>
    </div>
  );
}
