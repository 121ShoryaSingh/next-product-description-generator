'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/schema/signInSchema';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { setSession } from '@/redux/features/session/sessionSlice';
import { useDispatch } from 'react-redux';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<signInSchema>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState(0);

  const handleSubmitInput =
    (field: keyof signInSchema) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setUser((prev) => ({ ...prev, [field]: e.target.value }));
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      setErrorStatus(0);
      const response = await axios.post('/api/login', user);
      if (response) {
        dispatch(
          setSession({
            user: response.data.user,
            expires:
              response.data.expires ||
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          })
        );
        router.refresh();
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
          setError('Enter the correct email');
          setErrorStatus(401);
        } else if (status === 400) {
          setError('Enter the correct password');
          setErrorStatus(400);
        } else {
          setError('Server error please try again');
          setErrorStatus(500);
          toast.error('Something went wrong');
        }
      } else if (error instanceof Error) {
        // Handle regular JavaScript errors
        setError(error.message);
        setErrorStatus(0);
        toast.error('Something went wrong');
      } else {
        // Handle unknown error types
        setError('An unexpected error occurred');
        setErrorStatus(0);
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50">
      <div className="max-w-md mx-auto pt-16">
        <form
          className="bg-white flex flex-col gap-5 px-8 rounded-2xl py-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center justify-center">
            <Package className="w-12 h-12 text-blue-500 mb-8" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500 ">Sign in to your ProductAI account</p>
            <div className="border border-blue-600 bg-blue-100 p-3 text-center w-full rounded-lg">
              <h4 className="text-blue-800 font-semibold">Demo Login:</h4>
              <p className="text-blue-500 text-xs">
                Use the given email and passowrd <br /> Email: demo@example2.com
                , Pass: demo
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-black">
            <div className="flex flex-col gap-3">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className={
                  errorStatus === 401
                    ? 'border-red-500 focus:border-red-500 placeholder:text-black'
                    : 'bg-gray-200 focus:bg-gray-200 placeholder:text-black'
                }
                onChange={handleSubmitInput('email')}
                disabled={isLoading}
              />
              {errorStatus === 401 && (
                <p className="text-red-600 text-xs px-3">{error}</p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className={
                  errorStatus === 400
                    ? 'border-red-500 focus:border-red-500 placeholder:text-black'
                    : 'bg-gray-200 focus:bg-gray-200 placeholder:text-black'
                }
                onChange={handleSubmitInput('password')}
                disabled={isLoading}
              />
              {errorStatus === 400 && (
                <p className="text-red-600 text-xs px-3">{error}</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={() => {
              router.push('/dashboard');
            }}
          >
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
          <p>
            New to the platform?{' '}
            <span
              className="text-blue-600 hover:underline hover:cursor-pointer"
              onClick={() => {
                router.push('/register');
              }}
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
