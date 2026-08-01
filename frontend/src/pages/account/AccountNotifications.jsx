import { useState } from 'react'
import { Bell, Mail, MessageSquare, Smartphone, Megaphone, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Switch } from '../../components/ui/switch.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Plane } from "lucide-react";

const CHANNELS = [
  { id: 'bookingUpdates', icon: Bell, title: 'Booking updates', text: 'Confirmations, e-tickets and itinerary changes', color: 'text-brand-600 bg-brand-50' },
  { id: 'flightUpdates', icon: Plane, title: 'Flight updates', text: 'Schedule changes, gate info and delays', color: 'text-sky-600 bg-sky-50' },
  { id: 'priceAlerts', icon: TrendingUp, title: 'Price alerts', text: 'Drops on routes you track', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'promotional', icon: Megaphone, title: 'Promotional emails', text: 'Deals, offers and product updates', color: 'text-sun-600 bg-sun-50' },
  { id: 'sms', icon: Smartphone, title: 'SMS notifications', text: 'Critical trip alerts via SMS', color: 'text-violet-600 bg-violet-50' },
  { id: 'push', icon: Bell, title: 'Push notifications', text: 'Real-time alerts on your devices', color: 'text-rose-600 bg-rose-50' },
]

export default function AccountNotifications() {
  const { toast } = useToast()
  const [prefs, setPrefs] = useState({
    bookingUpdates: true, flightUpdates: true, priceAlerts: true,
    promotional: false, sms: true, push: true,
  })

  const toggle = (id) => {
    setPrefs((p) => {
      const next = { ...p, [id]: !p[id] }
      return next
    })
    toast(`Notification preference updated.`, 'Saved')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Mail className="size-5 text-brand-600" /> Notification preferences</CardTitle>
        <CardDescription>Choose how Project Sunrise reaches you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100">
          {CHANNELS.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-start gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${c.color}`}>
                  <c.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.text}</p>
                </div>
              </div>
              <Switch checked={prefs[c.id]} onCheckedChange={() => toggle(c.id)} />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <p className="flex items-center gap-2 font-semibold text-slate-700"><MessageSquare className="size-3.5" /> Pro tip</p>
          <p className="mt-1">Flight update notifications are sent automatically for bookings with a future departure date — you don't need to switch them on.</p>
        </div>
      </CardContent>
    </Card>
  )
}
