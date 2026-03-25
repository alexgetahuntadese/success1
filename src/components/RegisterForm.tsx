
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';

interface RegisterFormProps {
  onRegister: (userData: { name: string; grade: string; school?: string }) => void;
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const RegisterForm = ({ onRegister, onSwitchToLogin, onBack }: RegisterFormProps) => {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  
  const {
    formState,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateForm,
    resetForm
  } = useFormValidation({
    name: {
      value: '',
      error: '',
      rules: { required: true, minLength: 2 }
    },
    email: {
      value: '',
      error: '',
      rules: { required: true, email: true }
    },
    password: {
      value: '',
      error: '',
      rules: { required: true, minLength: 6 }
    },
    school: {
      value: '',
      error: '',
      rules: {}
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Register form submitted');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    if (!selectedGrade) {
      toast({
        title: "Grade Required",
        description: "Please select your grade level",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        name: formState.name.value,
        grade: selectedGrade,
        school: formState.school.value || undefined
      };
      
      console.log('Registration successful:', userData);
      
      toast({
        title: "Account Created!",
        description: "Welcome to EthioQuiz 2050",
      });
      
      resetForm();
      setSelectedGrade('');
      onRegister(userData);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const grades = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
  ];

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <div className="w-10" />
        </div>
        <CardDescription className="text-blue-200">
          Join thousands of Ethiopian students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formState.name.value}
              onChange={(e) => updateField('name', e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isSubmitting}
              required
            />
            {formState.name.error && (
              <p className="text-red-300 text-sm">{formState.name.error}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formState.email.value}
              onChange={(e) => updateField('email', e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isSubmitting}
              required
            />
            {formState.email.error && (
              <p className="text-red-300 text-sm">{formState.email.error}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formState.password.value}
              onChange={(e) => updateField('password', e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isSubmitting}
              required
            />
            {formState.password.error && (
              <p className="text-red-300 text-sm">{formState.password.error}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grade" className="text-white">Grade Level</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={isSubmitting}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    Grade {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school" className="text-white">School (Optional)</Label>
            <Input
              id="school"
              type="text"
              placeholder="Enter your school name"
              value={formState.school.value}
              onChange={(e) => updateField('school', e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isSubmitting}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/80">
            Already have an account?{' '}
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="text-blue-300 hover:text-blue-200 p-0 font-semibold"
              disabled={isSubmitting}
            >
              Sign In
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
