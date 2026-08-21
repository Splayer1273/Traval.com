import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { success } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      success('Welcome back! This is a demo login.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHero image="city" title="Sign In" subtitle="Access your corporate travel dashboard" crumb={[{ label: 'Login' }]} />

      <div className="container-x mt-8 flex justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Enter your credentials to access your account</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" placeholder="you@company.com" className="pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              This is a demo login. Enter any email and password to sign in.
            </p>

            <p className="mt-4 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-600 hover:underline">Create one</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
