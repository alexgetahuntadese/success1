
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormValidation } from '@/hooks/useFormValidation';

interface LoginFormProps {
  onLogin: (userData: { name: string; grade: string; school?: string }) => void;
  onSwitchToRegister: () => void;
  onBack: () => void;
}

const LoginForm = ({ onLogin, onSwitchToRegister, onBack }: LoginFormProps) => {
  const { toast } = useToast();
  
  const {
    formState,
    isSubmitting,
    setIsSubmitting,
    updateField,
    validateForm,
    resetForm
  } = useFormValidation({
    email: {
      value: '',
      error: '',
      rules: { required: true, email: true }
    },
    password: {
      value: '',
      error: '',
      rules: { required: true, minLength: 6 }
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Login form submitted');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const userData = {
        name: "Student User",
        grade: "12",
        school: "Test School"
      };
      
      console.log('Login successful:', userData);
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to EthioQuiz 2050",
      });
      
      resetForm();
      onLogin(userData);
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <CardTitle className="text-2xl text-white">Sign In</CardTitle>
          <div className="w-10" />
        </div>
        <CardDescription className="text-blue-200">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
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
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-white/80">
            Don't have an account?{' '}
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              className="text-blue-300 hover:text-blue-200 p-0 font-semibold"
              disabled={isSubmitting}
            >
              Create Account
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
