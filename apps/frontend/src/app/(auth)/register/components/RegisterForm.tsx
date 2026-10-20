'use client'

import { useState } from 'react'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RegisterInput, registerSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true)

    // Prototyping our data execution block before Week 3 network integration
    console.log('Registration Client Validation Passed. Safe Payload Object:', data)

    // Simulating API network latency safely
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        {/* Full Name Field Block */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('name')} // Binding input state directly to your Zod schema schema contract
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field Block */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Email Address</label>
          <Input
            type="email"
            placeholder="name@example.com"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field Block */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Password</label>
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
          {isSubmitting ? 'Creating Profile...' : 'Register Account'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </form>
  )
}
export default RegisterForm
