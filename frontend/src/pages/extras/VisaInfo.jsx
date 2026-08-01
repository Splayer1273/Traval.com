import { BadgeCheck, Clock, FileText, Globe, ShieldCheck } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const VISA_TABLE = [
  { country: 'UAE (Dubai)', type: 'Visa on arrival / eVisa', fee: '₹3,500 – ₹7,000', processing: '2–4 days', entry: 'Single / Multiple', notes: 'On-arrival for Indian passport holders with return ticket & hotel booking.' },
  { country: 'Indonesia (Bali)', type: 'Visa on arrival', fee: '₹2,400 (500k IDR)', processing: 'Instant', entry: 'Single (30 days)', notes: 'Payable at the airport in cash or card. Extendable once.' },
  { country: 'Thailand', type: 'Visa on arrival', fee: '₹4,500 (2,000 THB)', processing: 'Instant', entry: 'Single (15 days)', notes: 'Available at major airports. Carry 2 passport photos.' },
  { country: 'Singapore', type: 'eVisa (via authorised agents)', fee: '₹2,500 – ₹4,000', processing: '3–5 working days', entry: 'Multiple (30 days)', notes: 'Indian nationals need a visa. Apply through an ICA-authorised agent.' },
  { country: 'United Kingdom', type: 'Standard Visitor Visa', fee: '£115 (≈₹12,500)', processing: '3–6 weeks', entry: 'Multiple (6 months)', notes: 'Biometrics at a VFS centre. Strong financial docs required.' },
  { country: 'USA', type: 'B1/B2 Visitor Visa', fee: '$185 (≈₹15,500)', processing: '2–6 weeks', entry: 'Multiple (10 years)', notes: 'DS-160 form + interview at the US Embassy. Bring strong ties to home.' },
  { country: 'Switzerland', type: 'Schengen Visa (Type C)', fee: '€90 (≈₹8,300)', processing: '15 working days', entry: 'Multiple (90 days / 180)', notes: 'Apply at VFS; Schengen insurance with €30,000 cover required.' },
  { country: 'Japan', type: 'Tourist Visa', fee: '₹1,200 (free for some)', processing: '5–7 working days', entry: 'Single (15 days)', notes: 'Apply via VFS. Bank statement for last 6 months required.' },
]

const STEPS = [
  { title: 'Check requirements', text: 'Confirm visa type, fees and documents for your nationality and destination.', icon: Globe },
  { title: 'Prepare documents', text: 'Passport (6-month validity), photos, itinerary, hotel & flight confirmations, funds proof.', icon: FileText },
  { title: 'Submit application', text: 'Apply online or at the embassy/VFS centre, pay the fee and attend biometrics/interview if needed.', icon: BadgeCheck },
  { title: 'Track & collect', text: 'Track status online, collect your passport and fly with your visa in hand.', icon: Clock },
]

export default function VisaInfo() {
  const { toast } = useToast()
  return (
    <div>
      <PageHero image="passport" title="Visa Information" subtitle="Everything you need to know before you fly — requirements, fees and processing times" crumb={[{ label: 'Visa Information' }]} />

      <div className="container-x mt-8 space-y-8">
        {/* How it works */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="absolute -top-3 left-5 flex size-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><s.icon className="size-5" /></span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>

        {/* Visa table */}
        <Card>
          <CardContent className="p-0 sm:p-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                    <th className="p-4 font-semibold">Destination</th>
                    <th className="p-4 font-semibold">Visa type</th>
                    <th className="p-4 font-semibold">Fee (approx)</th>
                    <th className="p-4 font-semibold">Processing</th>
                    <th className="p-4 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {VISA_TABLE.map((v) => (
                    <tr key={v.country} className="transition-colors hover:bg-brand-50/30">
                      <td className="p-4 font-bold text-slate-800">{v.country}</td>
                      <td className="p-4 text-slate-600">{v.type}</td>
                      <td className="p-4 font-semibold text-slate-700">{v.fee}</td>
                      <td className="p-4 text-slate-600">{v.processing}</td>
                      <td className="max-w-xs p-4 text-xs leading-relaxed text-slate-500">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white shadow-lift">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-semibold"><ShieldCheck className="size-5 text-sun-300" /> Need visa assistance?</p>
            <p className="mt-1 text-sm text-brand-100">Our visa desk handles applications end-to-end — documents, appointments and tracking.</p>
          </div>
          <button
            type="button"
            onClick={() => toast('A visa specialist will contact you within 2 hours.', 'Visa assistance')}
            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-card transition-transform hover:scale-[1.03]"
          >
            Get free consultation
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['6-month passport validity', '2 passport-size photos', 'Return flight tickets', 'Hotel booking confirmation', 'Bank statement (3–6 months)', 'Travel insurance'].map((d) => (
            <Badge key={d} variant="secondary" className="px-3 py-1.5">{d}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
