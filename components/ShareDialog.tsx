import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Share2, Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/types';

interface ShareDialogProps {
  title?: string;
  description?: string;
  url?: string;
  trigger?: React.ReactNode;
  iconOnly?: boolean;
  type?: 'activity' | 'badge';
  badge?: Badge;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareDialog({
  title,
  description,
  url,
  trigger,
  iconOnly = false,
  type = 'activity',
  badge,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: ShareDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Generate content based on type
  const shareTitle = type === 'badge' && badge
    ? `🏆 I earned the "${badge.name}" badge on SDGgo!`
    : title || '';

  const shareDescription = type === 'badge' && badge
    ? badge.description
    : description;

  const shareUrl = url || 'https://sdggo.example.com';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied!', {
        description: 'Share link copied to clipboard'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out: ${shareTitle}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setOpen(false);
  };

  const handleShareWeChat = () => {
    // WeChat sharing requires QR code or app integration
    // For web, we'll copy the link and show instructions
    handleCopyLink();
    toast.info('WeChat Sharing', {
      description: 'Link copied! Paste in WeChat to share'
    });
    setOpen(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`I thought you might be interested in this:\n\n${shareTitle}\n${shareDescription || ''}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setOpen(false);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(shareTitle);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      {!trigger && !controlledOpen && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size={iconOnly ? "icon" : "sm"}
            aria-label={iconOnly ? `Share ${type === 'badge' ? 'badge' : 'activity'}` : undefined}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {!iconOnly && <span className="ml-1">Share</span>}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share {type === 'badge' ? 'Badge' : 'Activity'}</DialogTitle>
          <DialogDescription>
            {type === 'badge'
              ? 'Share your achievement with others'
              : `Share this ${shareDescription || 'content'} with others`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Copy Link */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-700 dark:text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-2">{copied ? 'Copied!' : 'Copy Link'}</span>
          </Button>

          {/* WeChat */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareWeChat}
          >
            <div className="h-4 w-4 flex items-center justify-center text-green-700 dark:text-green-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1 .134-.546c1.515-1.123 2.488-2.832 2.488-4.66 0-3.514-3.274-6.097-7.004-6.097zm-2.53 2.178c.536 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.433-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.433-.982.969-.982z" />
              </svg>
            </div>
            <span className="ml-2">WeChat</span>
          </Button>

          {/* WhatsApp */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareWhatsApp}
          >
            <div className="h-4 w-4 flex items-center justify-center text-green-700 dark:text-green-500">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="ml-2">WhatsApp</span>
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareEmail}
          >
            <Mail className="h-4 w-4" />
            <span className="ml-2">Email</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Social Media</span>
            </div>
          </div>

          {/* Twitter/X */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareTwitter}
          >
            <div className="h-4 w-4 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="ml-2">X (Twitter)</span>
          </Button>

          {/* Facebook */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareFacebook}
          >
            <div className="h-4 w-4 flex items-center justify-center text-blue-600">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="ml-2">Facebook</span>
          </Button>

          {/* LinkedIn */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShareLinkedIn}
          >
            <div className="h-4 w-4 flex items-center justify-center text-blue-700">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <span className="ml-2">LinkedIn</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
