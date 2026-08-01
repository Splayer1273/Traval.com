import { Headphones, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const OPTIONS = [
  { icon: MessageCircle, title: 'Live chat', text: 'Average reply time: under 1 minute', cta: 'Start chat', color: 'text-brand-600 bg-brand-50' },
  { icon: Phone, title: 'Call us', text: '24×7 toll-free support', cta: '+91 1800 419 4200', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Mail, title: 'Email support', text: 'Replies within 4 hours', cta: 'support@sunrise.travel', color: 'text-sun-600 bg-sun-50' },
  { icon: HelpCircle, title: 'Help center', text: 'Guides, FAQs and policies', cta: 'Browse articles', color: 'text-violet-600 bg-violet-50' },
]

export default function AccountSupport() {
  const { toast } = useToast()
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Headphones className="size-5 text-brand-600" /> Help & support</CardTitle>
          <CardDescription>We're here 24×7 for anything travel-related.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <div key={o.title} className="rounded-2xl border border-slate-200 p-5 transition-colors hover:border-brand-300">
              <span className={`flex size-11 items-center justify-center rounded-xl ${o.color}`}><o.icon className="size-5" /></span>
              <p className="mt-3 text-sm font-bold text-slate-900">{o.title}</p>
              <p className="mt-1 text-xs text-slate-500">{o.text}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => toast(`Opening ${o.title} — a specialist will assist you shortly.`, 'Support')}>
                {o.cta}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Common quick actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {['Change flight', 'Add baggage', 'Request refund', 'Print invoice', 'Visa assistance', 'Travel insurance'].map((a) => (
            <Button key={a} variant="secondary" size="sm" onClick={() => toast(`${a} request submitted. Our team will reach out shortly.`, 'Request received')}>
              {a}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
