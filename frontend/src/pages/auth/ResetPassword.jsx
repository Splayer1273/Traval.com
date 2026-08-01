import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { authApi } from '../../services/authApi.js'
import { useToast } from '../../context/ToastContext.jsx'

export default function ResetPassword() {
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ code: '', password: '', confirm: '' })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return error('Passwords do not match.', 'Reset failed')
    setLoading(true)
    try {
      await authApi.resetPassword({ token: form.code, password: form.password })
      success('Password updated. You can now sign in with your new password.', 'All set')
      navigate('/login')
    } catch (err) {
      error(err.message, 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Enter the reset code from your email along with your new password."
      footer={
        <>
          Need another code?{' '}
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:underline">Resend</Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label htmlFor="code">Reset code</Label>
          <Input id="code" className="mt-1.5 font-mono uppercase" placeholder="6-digit code from email" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="password">New password</Label>
          <div className="relative mt-1.5">
            <Input id="password" type={show ? 'text' : 'password'} className="pr-10" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle visibility">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input id="confirm" type={show ? 'text' : 'password'} className="mt-1.5" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
          {loading ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
