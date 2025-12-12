import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import fetchWithAuth from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/Loader';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    message: 'Please select a role',
  }),
});

type AdminRegisterForm = z.infer<typeof schema>;

interface AddAdminProps {
  onSuccess?: () => void;
}

export default function AddAdmin({ onSuccess }: AddAdminProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<AdminRegisterForm>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'editor',
    }
  });

  const selectedRole = watch('role');
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const onSubmit = async (data: AdminRegisterForm) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      setLoading(false);

      if (res.ok) {
        toast.success('Admin Created Successfully!');
        // Reset form
        setValue('name', '');
        setValue('email', '');
        setValue('password', '');
        setValue('role', 'editor');
        setStep(1);
        
        // Call onSuccess callback to refresh the admin list
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await res.json();
        toast.error('Creation failed', { description: errorData.error });
      }
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Creation failed';
      toast.error('Creation failed', { description: message });
    }
  };

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <Card className="max-w-md mx-auto py-8 px-6 bg-gray-50 dark:bg-gray-900/90">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-center">Add Admin</CardTitle>
        <div className="mt-4">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-xs text-center mt-2 text-gray-500">Step {step} of {totalSteps}</p>
        </div>
      </CardHeader>

      <CardContent>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-hidden relative"
          animate={{ height: 'auto' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {step === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name?.message && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  <Button
                    type="button"
                    className="w-full mt-4 text-gray-200"
                    onClick={() => getValues('name') && setStep(2)}
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email?.message && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className='text-gray-200' type="button" onClick={() => getValues('email') && setStep(3)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password?.message && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button className='text-gray-200' type="button" onClick={() => getValues('password') && setStep(4)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={selectedRole || 'editor'}
                    onValueChange={(value) => setValue('role', value as 'admin' | 'editor' | 'viewer')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 dark:bg-gray-900/90">
                      <SelectItem
                        value="admin"
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200"
                      >
                        Admin (Full Access)
                      </SelectItem>
                      <SelectItem
                        value="editor"
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200"
                      >
                        Editor (Edit Access)
                      </SelectItem>
                      <SelectItem
                        value="viewer"
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-gray-200 data-[highlighted]:bg-primary-light data-[highlighted]:text-gray-200"
                      >
                        Viewer (Read Only)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role?.message && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button type="submit" className="text-gray-200" disabled={loading}>
                      {loading ? <Loader /> : 'Create Admin'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.form>
      </CardContent>
    </Card>
  );
}

