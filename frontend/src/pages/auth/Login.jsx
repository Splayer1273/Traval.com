import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Checkbox } from '../../components/ui/checkbox.jsx'
import { Separator } from '../../components/ui/separator.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Login() {
  const { login, loading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: true })

  const doLogin = async (email = form.email, password = form.password) => {
    try {
      await login({ email, password })
      success('Signed in to the corporate portal.', 'Welcome back')
      navigate('/')
    } catch (e) {
      error(e.message, 'Sign in failed')
    }
  }

  return (
    <AuthLayout
      title="Sign in to your workspace"
      subtitle="Corporate travel management for Acme Technologies — book business trips, follow policy and track approvals."
      footer={
        <>
          New to the corporate portal?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">Request an account</Link>
        </>
      }
    >
      <div className="space-y-5">
        {/* Demo accounts */}
        <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-700">Demo accounts · password: Password@123</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => doLogin('rahul@acme.com', 'Password@123')}
              className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            >
              🧑‍💻 Employee
            </button>
            <button
              type="button"
              onClick={() => doLogin('amit@acme.com', 'Password@123')}
              className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            >
              🛂 Approver
            </button>
            <button
              type="button"
              onClick={() => doLogin('finance@acme.com', 'Password@123')}
              className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            >
              💰 Finance
            </button>
            <button
              type="button"
              onClick={() => doLogin('admin@acme.com', 'Password@123')}
              className="rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold uppercase text-slate-400">or sign in with email</span>
          <Separator className="flex-1" />
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); doLogin() }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="email">Work email address</Label>
            <Input id="email" type="email" className="mt-1.5" placeholder="rahul@acme.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative mt-1.5">
              <Input id="password" type={show ? 'text' : 'password'} className="pr-10" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={form.remember} onCheckedChange={(v) => setForm({ ...form, remember: !!v })} />
            Remember me for 30 days
          </label>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold uppercase text-slate-400">social login</span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" type="button" onClick={() => success('Google sign-in coming soon.', 'Social login')}>
            <svg className="size-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </Button>
          <Button variant="secondary" type="button" onClick={() => success('Apple sign-in coming soon.', 'Social login')}>
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            Apple
          </Button>
        </div>
      </div>
    </AuthLayout>
  )
}
