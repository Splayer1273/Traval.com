import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Checkbox } from '../../components/ui/checkbox.jsx'
import { Progress } from '../../components/ui/progress.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function strength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const LABELS = [
  { min: 5, label: 'Very strong', color: 'text-emerald-600', bar: 100 },
  { min: 4, label: 'Strong', color: 'text-emerald-500', bar: 80 },
  { min: 3, label: 'Good', color: 'text-sun-600', bar: 60 },
  { min: 2, label: 'Fair', color: 'text-amber-500', bar: 40 },
  { min: 1, label: 'Weak', color: 'text-rose-500', bar: 20 },
  { min: 0, label: '', color: '', bar: 0 },
]

export default function Register() {
  const { register, loading } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', terms: false })

  const score = useMemo(() => strength(form.password), [form.password])
  const meta = LABELS.find((l) => score >= l.min)

  const doRegister = async (e) => {
    e.preventDefault()
    if (!form.terms) return error('Please accept the Terms & Conditions to continue.', 'Almost there')
    if (form.password !== form.confirm) return error('Passwords do not match.', 'Almost there')
    if (score < 2) return error('Please choose a stronger password.', 'Almost there')
    try {
      await register(form)
      success('Your corporate account is ready. Welcome aboard!', 'Account created')
      navigate('/')
    } catch (err) {
      error(err.message, 'Registration failed')
    }
  }

  return (
    <AuthLayout
      title="Request a corporate account"
      subtitle="Your administrator provisions travel access — sign in with your work email once your account is active."
      footer={
        <>
          Already have a corporate account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={doRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" className="mt-1.5" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" className="mt-1.5" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" className="mt-1.5" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" type="tel" className="mt-1.5" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1.5">
            <Input id="password" type={show ? 'text' : 'password'} className="pr-10" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle password visibility">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2 space-y-1">
              <Progress value={meta.bar} />
              <p className={`text-xs font-semibold ${meta.color}`}>
                {meta.label}{score >= 2 ? ` · ${['8+ chars', 'Uppercase', 'Number', 'Symbol'].filter((_, i) => score > i + 1).length} of 4 checks passed` : ''}
              </p>
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type={show ? 'text' : 'password'} className="mt-1.5" placeholder="Re-enter your password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
          <Checkbox className="mt-0.5" checked={form.terms} onCheckedChange={(v) => setForm({ ...form, terms: !!v })} />
          <span>
            I agree to the <Link to="/terms" className="font-semibold text-brand-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="font-semibold text-brand-600 hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
