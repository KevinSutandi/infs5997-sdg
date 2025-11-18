'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  onSignUp?: () => void;
  message?: string;
}

export function LoginDialog({ open, onOpenChange, onLogin, onSignUp, message }: LoginDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // In a real app, this would validate credentials with backend
    // For now, we'll just check if fields are filled
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    // Mock login - in real app, this would be an API call
    // For demo purposes, we'll just call onLogin
    setError('');
    onLogin();
    onOpenChange(false);

    // Reset form
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Sign In Required</DialogTitle>
          <DialogDescription className="text-center">
            {message || 'Please sign in to continue with this action'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="z1234567@student.unsw.edu.au"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            <p>Don&apos;t have an account? Sign up to get started!</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          {onSignUp && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onSignUp();
              }}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          )}
          <Button onClick={handleSubmit} className="w-full sm:flex-1">
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

