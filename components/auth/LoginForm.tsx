/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInAccount, sendMagicLink, sendEmailOTP, account } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '../ui/icons';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { AuthMethod, LoginFormData, loginSchema } from '@/schema/form';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password');
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
  
      let user;
      const redirectUrl = "https://localhost:3000/dashboard";
  
      switch (authMethod) {
        case 'magic-link':
          console.log("Sending magic link to:", data.email);
          await sendMagicLink(data.email, redirectUrl);
          break;
  
        case 'email-otp':
          console.log("Sending email OTP to:", data.email);
          await sendEmailOTP(data.email);
          break;
  
        default:
          toast.success("Signing in with email and password");
          user = await signInAccount(data.email, data.password);
          if (user) {
            toast.success("Log in Successful!");
            router.push("/dashboard");
          }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(`Login failed: ${error instanceof Error ? error.message : error}`);
    } finally {
      setIsLoading(false);
    }
  };
   

  return (
    <motion.div className="w-full max-w-md mx-auto mt-24 border dark:border-gray-700 rounded-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your email and password to sign in</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" className="border dark:border-gray-700" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {authMethod === 'password' && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" className="border dark:border-gray-700" placeholder="Enter Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-4 justify-evenly">
                <Button
                  type="button"
                  className="w-full border dark:border-gray-700"
                  variant={authMethod === 'password' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('password')}
                >
                  Password Login
                </Button>
                <Button
                  type="button"
                  className="w-full border dark:border-gray-700"
                  variant={authMethod === 'magic-link' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('magic-link')}
                >
                  Magic Link
                </Button>
                <Button
                  type="button"
                  className="w-full border dark:border-gray-700"
                  variant={authMethod === 'email-otp' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('email-otp')}
                >
                  Email OTP
                </Button>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {authMethod === 'password' ? 'Sign In' : 'Send Link/OTP'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link href="/reset-password" className="hover:text-primary underline underline-offset-4">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="hover:text-primary underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
