import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import fetchWithAuth from '@/lib/api';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/components/Loader';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  dob: z.string().min(4, 'Date of birth is required'),
  nin: z.string().min(11, 'NIN is required'),
  phones: z.array(z.string())
    .refine((phones) => phones.filter(p => p && p.trim().length >= 7).length > 0, {
      message: 'At least one valid phone number is required (minimum 7 characters)'
    }),
  addresses: z.array(z.string())
    .refine((addresses) => addresses.filter(a => a && a.trim().length >= 4).length > 0, {
      message: 'At least one valid address is required (minimum 4 characters)'
    }),
});

type DriverRegisterForm = z.infer<typeof schema>;

export default function AddDriver() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneInputs, setPhoneInputs] = useState(['']);
  const [addressInputs, setAddressInputs] = useState(['']);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<DriverRegisterForm>({ 
    resolver: zodResolver(schema),
    mode: 'onSubmit', // Only validate on submit, not on change or blur
    defaultValues: {
      phones: [''],
      addresses: [''],
    }
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const addPhoneInput = () => {
    setPhoneInputs([...phoneInputs, '']);
    setValue('phones', [...phoneInputs, '']);
  };

  const removePhoneInput = (index: number) => {
    const newPhones = phoneInputs.filter((_, i) => i !== index);
    setPhoneInputs(newPhones);
    setValue('phones', newPhones);
  };

  const updatePhoneInput = (index: number, value: string) => {
    const newPhones = [...phoneInputs];
    newPhones[index] = value;
    setPhoneInputs(newPhones);
    setValue('phones', newPhones);
  };

  const addAddressInput = () => {
    setAddressInputs([...addressInputs, '']);
    setValue('addresses', [...addressInputs, '']);
  };

  const removeAddressInput = (index: number) => {
    const newAddresses = addressInputs.filter((_, i) => i !== index);
    setAddressInputs(newAddresses);
    setValue('addresses', newAddresses);
  };

  const updateAddressInput = (index: number, value: string) => {
    const newAddresses = [...addressInputs];
    newAddresses[index] = value;
    setAddressInputs(newAddresses);
    setValue('addresses', newAddresses);
  };

  const onSubmit = async (data: DriverRegisterForm) => {
    setLoading(true);
    try {
      // Sync form state with current inputs before processing
      const syncedPhones = phoneInputs.filter(phone => phone && phone.trim().length > 0);
      const syncedAddresses = addressInputs.filter(addr => addr && addr.trim().length > 0);
      
      // Update form values to match current state
      setValue('phones', syncedPhones, { shouldValidate: false });
      setValue('addresses', syncedAddresses, { shouldValidate: false });

      // Use the current state values instead of form data to ensure sync
      const currentPhones = syncedPhones.filter(phone => phone.trim().length >= 7);
      const currentAddresses = syncedAddresses.filter(addr => addr.trim().length >= 4);

      // Validate that we have at least one phone and address
      if (currentPhones.length === 0) {
        toast.error('Validation failed', { description: 'At least one valid phone number is required (minimum 7 characters)' });
        setLoading(false);
        return;
      }

      if (currentAddresses.length === 0) {
        toast.error('Validation failed', { description: 'At least one valid address is required (minimum 4 characters)' });
        setLoading(false);
        return;
      }

      const requestBody = {
        name: data.name,
        email: data.email,
        password: data.password,
        dob: data.dob,
        nin: data.nin,
        phones: currentPhones,
        addresses: currentAddresses,
      };

      console.log('Submitting driver registration:', { 
        email: requestBody.email, 
        phonesCount: requestBody.phones.length,
        addressesCount: requestBody.addresses.length,
        phones: requestBody.phones,
        addresses: requestBody.addresses
      });

      const res = await fetchWithAuth('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      setLoading(false);

      if (res.ok) {
        toast.success('Driver Registered Successfully!');
        // Reset form and state
        setPhoneInputs(['']);
        setAddressInputs(['']);
        setValue('name', '');
        setValue('email', '');
        setValue('password', '');
        setValue('dob', '');
        setValue('nin', '');
        setValue('phones', ['']);
        setValue('addresses', ['']);
        setStep(1);
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error occurred' }));
        console.error('Registration failed:', errorData);
        
        // Handle specific error cases
        if (errorData.error === 'Email already registered') {
          toast.error('Email already exists', { 
            description: 'This email is already registered. Please use a different email address.' 
          });
        } else {
          toast.error('Registration failed', { description: errorData.error || 'Unknown error occurred' });
        }
      }
    } catch (err) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error('Registration failed', { description: message });
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
        <CardTitle className="text-2xl font-bold text-center">Driver Registration</CardTitle>
        <div className="mt-4">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-xs text-center mt-2 text-gray-500">Step {step} of {totalSteps}</p>
        </div>
      </CardHeader>

      <CardContent>
        <motion.form
          onSubmit={handleSubmit(
            onSubmit,
            (errors) => {
              console.error('Form validation errors:', errors);
              
              // Only show errors for fields that are actually invalid
              if (errors.addresses) {
                const validAddresses = addressInputs.filter(a => a && a.trim().length >= 4);
                if (validAddresses.length === 0) {
                  toast.error('Validation failed', { description: 'At least one valid address is required (minimum 4 characters)' });
                  return;
                }
              }
              
              if (errors.phones) {
                const validPhones = phoneInputs.filter(p => p && p.trim().length >= 7);
                if (validPhones.length === 0) {
                  toast.error('Validation failed', { description: 'At least one valid phone number is required (minimum 7 characters)' });
                  return;
                }
              }
              
              const firstError = Object.values(errors)[0];
              if (firstError?.message) {
                toast.error('Validation failed', { description: firstError.message });
              } else {
                toast.error('Validation failed', { description: 'Please check all fields and try again' });
              }
            }
          )}
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
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" {...register('dob')} />
                  {errors.dob?.message && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button className='text-gray-200' type="button" onClick={() => getValues('dob') && setStep(5)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-2">
                  <Label htmlFor="nin">NIN</Label>
                  <Input id="nin" {...register('nin')} />
                  {errors.nin?.message && <p className="text-red-500 text-sm">{errors.nin.message}</p>}
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(4)}>
                      Back
                    </Button>
                    <Button className='text-gray-200' type="button" onClick={() => getValues('nin') && setStep(6)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-2">
                  <Label>Phone Numbers</Label>
                  {phoneInputs.map((phone, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        id={`phone-${index}`}
                        value={phone}
                        onChange={(e) => updatePhoneInput(index, e.target.value)}
                        placeholder={`Phone number ${index + 1}`}
                      />
                      {phoneInputs.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removePhoneInput(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" onClick={addPhoneInput} className="mt-2 text-gray-200">
                    Add Phone Number
                  </Button>
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(5)}>
                      Back
                    </Button>
                    <Button 
                      className='text-gray-200' 
                      type="button"
                      onClick={() => {
                        const validPhones = phoneInputs.filter(phone => phone && phone.trim().length >= 7);
                        if (validPhones.length === 0) {
                          toast.error('Validation failed', { description: 'At least one valid phone number is required (minimum 7 characters)' });
                          return;
                        }
                        // Update form value without triggering validation
                        setValue('phones', phoneInputs, { shouldValidate: false, shouldDirty: true });
                        setStep(7);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="space-y-2">
                  <Label>Addresses</Label>
                  {addressInputs.map((address, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        id={`address-${index}`}
                        value={address}
                        onChange={(e) => updateAddressInput(index, e.target.value)}
                        placeholder={`Address ${index + 1}`}
                      />
                      {addressInputs.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeAddressInput(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" onClick={addAddressInput} className="mt-2 text-gray-200">
                    Add Address
                  </Button>
                  <div className="flex justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(6)}>
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="text-gray-200" 
                      disabled={loading}
                      onClick={(e) => {
                        // Ensure form state is synced before submission without triggering validation
                        setValue('phones', phoneInputs, { shouldValidate: false });
                        setValue('addresses', addressInputs, { shouldValidate: false });
                      }}
                    >
                      {loading ? <Loader /> : 'Submit'}
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