import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { useToast } from '../context/ToastContext.jsx'

const INFO = [
  { icon: Phone, title: 'Call us', lines: ['+91 1800 419 4200 (24×7)', '+91 22 6810 4100 (International)'] },
  { icon: Mail, title: 'Email', lines: ['support@sunrise.travel', 'sales@sunrise.travel'] },
  { icon: MapPin, title: 'Head office', lines: ['14, Marine Drive, Mumbai 400020', 'Maharashtra, India'] },
  { icon: Clock, title: 'Support hours', lines: ['Travel support: 24×7', 'Sales desk: 9am – 9pm IST'] },
]

export default function Contact() {
  const { success } = useToast()
  const [form, setForm] = useState({ name: '', email: '', topic: 'Booking support', message: '' })

  const submit = (e) => {
    e.preventDefault()
    success('Message received! Our team will reply within 4 working hours.', 'Thank you')
    setForm({ name: '', email: '', topic: 'Booking support', message: '' })
  }

  return (
    <div>
      <PageHero image="city" title="Contact Us" subtitle="We're here around the clock — questions, changes, or just to say hi" crumb={[{ label: 'Contact' }]} />

      <div className="container-x mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {INFO.map((c) => (
              <Card key={c.title}>
                <CardContent className="p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><c.icon className="size-5" /></span>
                  <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{c.title}</h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 text-sm text-slate-500">{l}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-semibold text-slate-900">Send us a message</h2>
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="c-name">Full name</Label>
                    <Input id="c-name" className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="c-email">Email</Label>
                    <Input id="c-email" type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label>Topic</Label>
                  <Select value={form.topic} onValueChange={(v) => setForm({ ...form, topic: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Booking support', 'Refunds & cancellations', 'Visa assistance', 'Partnership / B2B', 'Feedback', 'Something else'].map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea className="mt-1.5" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" required />
                </div>
                <Button type="submit" size="lg" className="w-full"><Send className="size-4" /> Send message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
