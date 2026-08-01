import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Mail, Send } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { authApi } from '../../services/authApi.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function ForgotPassword() {
  const { success, error } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
      success('If an account exists for that email, a reset link is on its way.', 'Check your inbox')
    } catch (err) {
      error(err.message, 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">Back to login</Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Mail className="size-6" /></span>
          <h2 className="mt-3 font-display text-lg font-semibold text-emerald-800">Reset link sent</h2>
          <p className="mt-1 text-sm text-emerald-700">
            We've sent a password reset link to <span className="font-bold">{email}</span>. It expires in 30 minutes.
          </p>
          <Button variant="secondary" className="mt-4" asChild><Link to="/reset-password">I have a reset code</Link></Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" className="mt-1.5" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
