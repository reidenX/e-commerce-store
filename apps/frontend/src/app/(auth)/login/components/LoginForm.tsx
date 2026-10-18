'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CardContent, CardFooter } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true)

    console.log('Optimistic Client-Side Validation Passed. Safe Payload:', data)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        {/* Email Field Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
          </div>
          <Input
            type="email"
            placeholder="name@example.com"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('email')} // Binding input stream state to our schema controller
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field Block */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Password</label>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 mt-4">
        {/* Dynamic UI Action Interceptor state feedback loop */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Authenticating...' : 'Sign In with Credentials'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </form>
  )
}
export default LoginForm
