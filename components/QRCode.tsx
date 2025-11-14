interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 120 }: QRCodeProps) {
  // Simple QR-like visual representation
  // In production, you would use a proper QR code library
  const createPattern = (text: string) => {
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pattern = [];
    for (let i = 0; i < 64; i++) {
      pattern.push((hash * (i + 1) * 7) % 2 === 0);
    }
    return pattern;
  };

  const pattern = createPattern(value);

  return (
    <div
      className="bg-white p-2 rounded border-2 border-border inline-block"
      style={{ width: size, height: size }}
    >
      <div className="grid grid-cols-8 gap-0 h-full w-full">
        {pattern.map((filled, index) => (
          <div
            key={index}
            className={`${filled ? 'bg-black' : 'bg-white'} rounded-sm`}
          />
        ))}
      </div>
      <div className="text-[6px] text-center mt-1 text-muted-foreground truncate">
        {value}
      </div>
    </div>
  );
}
