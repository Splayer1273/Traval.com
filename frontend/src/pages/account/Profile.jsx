import { useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import { Avatar, AvatarFallback } from '../../components/ui/avatar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const GENDERS = ['Male', 'Female', 'Other']
const NATIONALITIES = ['Indian', 'American', 'British', 'UAE', 'Singaporean', 'Thai', 'French', 'German', 'Japanese', 'Other']

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { success } = useToast()
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
    phone: user?.phone || '', dob: user?.dob || '', gender: user?.gender || 'Male',
    nationality: user?.nationality || 'Indian',
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = () => {
    updateUser(form)
    success('Your profile has been updated.', 'Profile saved')
  }

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
          <CardDescription>Your photo appears on bookings and to support agents.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <Avatar className="size-20">
            {user?.avatar ? <img src={user.avatar} alt={form.firstName} className="size-full object-cover" /> : null}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Camera className="size-4" /> Upload photo</Button>
            {user?.avatar && <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => updateUser({ avatar: null })}>Remove</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your name, contact details and identity information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div><Label>First name</Label><Input className="mt-1.5" value={form.firstName} onChange={set('firstName')} /></div>
          <div><Label>Last name</Label><Input className="mt-1.5" value={form.lastName} onChange={set('lastName')} /></div>
          <div><Label>Email</Label><Input type="email" className="mt-1.5" value={form.email} onChange={set('email')} /></div>
          <div><Label>Phone</Label><Input className="mt-1.5" value={form.phone} onChange={set('phone')} /></div>
          <div>
            <Label>Date of birth</Label>
            <Input type="date" className="mt-1.5" value={form.dob} onChange={set('dob')} />
          </div>
          <div>
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nationality</Label>
            <Select value={form.nationality} onValueChange={(v) => setForm((f) => ({ ...f, nationality: v }))}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {NATIONALITIES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="size-4" /> Save changes</Button>
      </div>
    </div>
  )
}
