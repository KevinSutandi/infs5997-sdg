import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { UserPlus, GraduationCap, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

interface SignupDialogProps {
  open: boolean;
  onSignup: (data: UserSignupData) => void;
  onSkip?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export interface UserSignupData {
  name: string;
  studentId: string;
  faculty: string;
  email?: string;
  password: string;
}

const FACULTIES = [
  'UNSW Business School',
  'Faculty of Engineering',
  'Faculty of Science',
  'Faculty of Arts, Design & Architecture',
  'Faculty of Law & Justice',
  'Faculty of Medicine & Health',
  'Faculty of Built Environment',
  'School of Computer Science & Engineering',
];

export function SignupDialog({ open, onSignup, onOpenChange }: SignupDialogProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const validateStudentId = (id: string): boolean => {
    // Format: Z followed by 7 digits (e.g., Z1234567)
    const studentIdRegex = /^z\d{7}$/;
    return studentIdRegex.test(id);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pwd: string) => {
    const validation = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(v => v);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!validateStudentId(studentId.trim())) {
      newErrors.studentId = 'Student ID must be in format Z followed by 7 digits (e.g., Z1234567)';
    }

    if (!faculty) {
      newErrors.faculty = 'Faculty is required';
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSignup({
      name: name.trim(),
      studentId: studentId.trim(),
      faculty,
      email: email.trim() || undefined,
      password: password,
    });
    // Close dialog after successful signup
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange || (() => { })}>
      <DialogContent className="max-w-md" showCloseButton={!!onOpenChange}>
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center mb-2">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to UNSW SDGgo!</DialogTitle>
          <DialogDescription className="text-center">
            Create your account to start tracking your SDG contributions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="signup-name">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signup-name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Student ID */}
          <div className="space-y-2">
            <Label htmlFor="signup-student-id">
              Student ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="signup-student-id"
              placeholder="z1234567"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (errors.studentId) setErrors({ ...errors, studentId: '' });
              }}
              aria-invalid={!!errors.studentId}
              maxLength={8}
            />
            {errors.studentId && (
              <p className="text-sm text-destructive">{errors.studentId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: z followed by 7 digits
            </p>
          </div>

          {/* Faculty */}
          <div className="space-y-2">
            <Label htmlFor="signup-faculty">
              Faculty <span className="text-destructive">*</span>
            </Label>
            <Select value={faculty} onValueChange={(value) => {
              setFaculty(value);
              if (errors.faculty) setErrors({ ...errors, faculty: '' });
            }}>
              <SelectTrigger id="signup-faculty" className="w-full" aria-invalid={!!errors.faculty}>
                <SelectValue placeholder="Select your faculty" />
              </SelectTrigger>
              <SelectContent>
                {FACULTIES.map((fac) => (
                  <SelectItem key={fac} value={fac}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {fac}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.faculty && (
              <p className="text-sm text-destructive">{errors.faculty}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="signup-email">
              Email <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="z1234567@student.unsw.edu.au"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Your UNSW student email address
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="signup-password">
              Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                aria-invalid={!!errors.password}
                className={errors.password ? 'border-destructive' : ''}
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
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}

            {/* Password Requirements */}
            {password && (
              <div className="space-y-1.5 mt-2 p-3 bg-muted/50 rounded-md border">
                <p className="text-xs font-semibold text-foreground mb-2">Password requirements:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.length ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordValidation.length ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.uppercase ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordValidation.uppercase ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.lowercase ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordValidation.lowercase ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.number ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className={passwordValidation.number ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'}>
                      One number
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                aria-invalid={!!errors.confirmPassword}
                className={errors.confirmPassword ? 'border-destructive' : confirmPassword && password === confirmPassword ? 'border-green-500' : ''}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                {errors.confirmPassword}
              </p>
            )}
            {confirmPassword && password === confirmPassword && !errors.confirmPassword && (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Passwords match
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleSubmit} className="w-full sm:flex-1">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

