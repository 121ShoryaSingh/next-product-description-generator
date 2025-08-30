'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schema/signUpSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState<signUpSchema>({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<number>(0);

  const handleInputChange =
    (field: keyof signUpSchema) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUser((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(false);
      setErrorStatus(0);
      setError('');
      const response = await axios.post('/api/register', user);
      router.push('/login');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorStatus(400);
        setError('User already exists');
      } else if (error.response?.status === 500) {
        setErrorStatus(500);
        setError('Server error. Please try again later');
      } else {
        setErrorStatus(500);
        setError('Something went wrong. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-400">
      <div className="max-w-lg mx-auto py-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white gap-4 px-8 rounded-2xl py-8"
        >
          <h1 className="text-2xl font-bold">Register</h1>
          <div className="flex flex-col gap-5 text-black">
            <div className="flex flex-col gap-3">
              <label htmlFor="name">Fullname</label>
              <Input
                id="name"
                className="bg-gray-200 placeholder:text-black"
                type="text"
                placeholder="Fullname"
                value={user.name}
                onChange={handleInputChange('name')}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                className={
                  errorStatus === 400
                    ? 'border-red-500 focus:border-red-500 placeholder:text-black'
                    : 'bg-gray-200 focus:bg-gray-200 placeholder:text-black'
                }
                type="text"
                placeholder="Email"
                value={user.email}
                onChange={handleInputChange('email')}
                disabled={isLoading}
              />
              {errorStatus === 400 && (
                <p className="text-red-600 text-xs px-3">{error}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                className="bg-gray-200 placeholder:text-black"
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={handleInputChange('password')}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
          >
            Submit
          </Button>
          <p>
            Already registered?{' '}
            <span
              className="text-blue-600 hover:underline hover:cursor-pointer"
              onClick={() => {
                router.push('/login');
              }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
