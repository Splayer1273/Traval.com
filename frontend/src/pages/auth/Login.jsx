import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Checkbox } from '../../components/ui/checkbox.jsx'
import { Separator } from '../../components/ui/separator.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Login() {
  const { login, googleLogin, loading } = useAuth()
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
        <div className="flex flex-col items-center gap-3">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await googleLogin(credentialResponse.credential)
                success('Signed in with Google.', 'Welcome back')
                navigate('/')
              } catch (e) {
                error(e.message, 'Google sign-in failed')
              }
            }}
            onError={() => {
              error('Google sign-in was cancelled or failed.', 'Sign in failed')
            }}
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>
      </div>
    </AuthLayout>
  )
}
