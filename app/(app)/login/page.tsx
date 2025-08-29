'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/schema/signInSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { setSession } from '@/redux/features/session/sessionSlice';
import { useDispatch } from 'react-redux';

export default function login() {
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
        console.log('control reached here');
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        setError('Enter the correct email');
        setErrorStatus(401);
      } else if (error.response.status === 400) {
        setError('Enter the correct password');
        setErrorStatus(400);
      } else {
        setError('Server error please try again');
        setErrorStatus(500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-400">
      <div className="max-w-lg mx-auto py-8">
        <form
          className="bg-white flex flex-col gap-5 px-8 rounded-2xl py-8"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold">Login</h1>
          <div className="flex flex-col gap-5 text-black">
            <div className="flex flex-col gap-3">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="text"
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
          >
            Login
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
