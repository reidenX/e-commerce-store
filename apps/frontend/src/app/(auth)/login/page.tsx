import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/app/(auth)/login/components/LoginForm'

const LoginPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and credentials to access your store dashboard.
          </CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  )
}
export default LoginPage
