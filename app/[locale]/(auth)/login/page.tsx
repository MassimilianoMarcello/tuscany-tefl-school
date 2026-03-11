// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form"

interface LoginPageProps {
  searchParams: Promise<{ reset?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reset } = await searchParams
  return <LoginForm resetSuccess={reset === "true"} />
}