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
import { UserPlus, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface SignupDialogProps {
  open: boolean;
  onSignup: (data: UserSignupData) => void;
  onSkip?: () => void;
}

export interface UserSignupData {
  name: string;
  studentId: string;
  faculty: string;
  email?: string;
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

export function SignupDialog({ open, onSignup, onSkip }: SignupDialogProps) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStudentId = (id: string): boolean => {
    // Format: Z followed by 7 digits (e.g., Z1234567)
    const studentIdRegex = /^Z\d{7}$/;
    return studentIdRegex.test(id);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" showCloseButton={false}>
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
              placeholder="Z1234567"
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
              Format: Z followed by 7 digits
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
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {onSkip && (
            <Button variant="outline" onClick={onSkip} className="w-full sm:w-auto">
              Skip for Now
            </Button>
          )}
          <Button onClick={handleSubmit} className="w-full sm:flex-1">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

