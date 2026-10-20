import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RegisterForm from '@/app/(auth)/register/components/RegisterForm'

const RegisterPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to establish your profile credentials.
          </CardDescription>
        </CardHeader>
        <RegisterForm />
      </Card>
    </div>
  )
}
export default RegisterPage
