import { useState } from 'react'
import { ShieldCheck, KeyRound, Monitor, Smartphone, History, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Switch } from '../../components/ui/switch.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { DEMO_USER } from '../../data/users.js'

export default function AccountSecurity() {
  const { toast, error } = useToast()
  const { user } = useAuth()
  const security = user?.security || DEMO_USER.security
  const [twoFactor, setTwoFactor] = useState(security.twoFactor)
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })

  const changePassword = () => {
    if (pw.next.length < 8) return error('New password must be at least 8 characters.', 'Change password')
    if (pw.next !== pw.confirm) return error('New passwords do not match.', 'Change password')
    setPw({ current: '', next: '', confirm: '' })
    toast('Password updated. You will be asked to sign in on other devices.', 'Password changed')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="size-5 text-brand-600" /> Change password</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Current password</Label>
            <div className="relative mt-1.5">
              <Input type={showPw ? 'text' : 'password'} value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} className="pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Toggle visibility">
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div><Label>New password</Label><Input type={showPw ? 'text' : 'password'} className="mt-1.5" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} /></div>
          <div><Label>Confirm new password</Label><Input type={showPw ? 'text' : 'password'} className="mt-1.5" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} /></div>
          <div className="flex items-end"><Button onClick={changePassword}>Update password</Button></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5 text-brand-600" /> Two-factor authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" /></span>
            <div>
              <p className="text-sm font-bold text-slate-800">Authenticator app / SMS codes</p>
              <p className="text-xs text-slate-500">We'll ask for a one-time code when you sign in on a new device.</p>
            </div>
          </div>
          <Switch checked={twoFactor} onCheckedChange={(v) => { setTwoFactor(v); toast(v ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.', 'Security') }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Monitor className="size-5 text-brand-600" /> Active sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {security.sessions.map((s) => (
              <div key={s.device} className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    {s.device.toLowerCase().includes('iphone') ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.device}</p>
                    <p className="text-xs text-slate-500">{s.location} · {s.lastActive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.active ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">This device</span>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50">Sign out</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="size-5 text-brand-600" /> Login history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 font-semibold">Date & time</th>
                  <th className="pb-2 font-semibold">Device</th>
                  <th className="pb-2 font-semibold">Location</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {security.loginHistory.map((l, i) => (
                  <tr key={i}>
                    <td className="py-3 text-slate-600">{l.date}</td>
                    <td className="py-3 text-slate-600">{l.device}</td>
                    <td className="py-3 text-slate-600">{l.location}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${l.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
