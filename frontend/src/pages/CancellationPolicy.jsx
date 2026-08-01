import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, Banknote, FileWarning } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'

const FLIGHT_RULES = [
  { window: 'More than 72 hours before departure', refundable: '100% fare refund (−₹2,500 fee)', nonRefundable: 'Only government taxes refunded' },
  { window: '72 – 24 hours before departure', refundable: '75% fare refund', nonRefundable: 'Only government taxes refunded' },
  { window: '24 – 2 hours before departure', refundable: '50% fare refund', nonRefundable: 'No refund' },
  { window: 'Less than 2 hours / no-show', refundable: 'No refund', nonRefundable: 'No refund' },
]

const HOTEL_RULES = [
  { window: 'Up to 48 hours before check-in', refundable: '100% refund', nonRefundable: 'No refund' },
  { window: '48 – 24 hours before check-in', refundable: '50% refund', nonRefundable: 'No refund' },
  { window: 'Less than 24 hours / no-show', refundable: 'No refund', nonRefundable: 'No refund' },
]

const PERKS = [
  { icon: ShieldCheck, title: 'Free cancellation window', text: 'Most flight and hotel bookings include free cancellation up to 24–48 hours before departure/check-in.' },
  { icon: Clock, title: 'Refund timeline', text: 'Refunds are initiated within 24–48 hours of cancellation and reflect in 5–7 working days.' },
  { icon: Banknote, title: 'Refund method', text: 'Refunds go back to your original payment method. Wallet credits from promo cancellations are instant.' },
  { icon: FileWarning, title: 'Force majeure', text: 'If a supplier cancels due to force majeure, you get a 100% refund or a free reschedule, whichever you prefer.' },
]

export default function CancellationPolicy() {
  return (
    <div>
      <PageHero image="city" title="Cancellation Policy" subtitle="Transparent, traveller-friendly rules — always shown before you pay" crumb={[{ label: 'Cancellation Policy' }]} />

      <div className="container-x mt-8 space-y-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><p.icon className="size-5" /></span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.text}</p>
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-0 sm:p-2">
            <div className="p-5 pb-0">
              <h2 className="font-display text-xl font-semibold text-slate-900">Flight cancellation & refund matrix</h2>
              <p className="mt-1 text-xs text-slate-500">Applicable per traveller; exact rules depend on your fare type (shown on the flight detail page).</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                    <th className="p-4 font-semibold">When you cancel</th>
                    <th className="p-4 font-semibold">Refundable fare</th>
                    <th className="p-4 font-semibold">Non-refundable fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {FLIGHT_RULES.map((r) => (
                    <tr key={r.window} className="transition-colors hover:bg-emerald-50/30">
                      <td className="p-4 font-semibold text-slate-800">{r.window}</td>
                      <td className="p-4 text-emerald-700">{r.refundable}</td>
                      <td className="p-4 text-slate-600">{r.nonRefundable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 sm:p-2">
            <div className="p-5 pb-0">
              <h2 className="font-display text-xl font-semibold text-slate-900">Hotel cancellation & refund matrix</h2>
              <p className="mt-1 text-xs text-slate-500">Rooms marked "Free cancellation" follow these windows; others are non-refundable at a lower price.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                    <th className="p-4 font-semibold">When you cancel</th>
                    <th className="p-4 font-semibold">Free cancellation rate</th>
                    <th className="p-4 font-semibold">Non-refundable rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {HOTEL_RULES.map((r) => (
                    <tr key={r.window} className="transition-colors hover:bg-emerald-50/30">
                      <td className="p-4 font-semibold text-slate-800">{r.window}</td>
                      <td className="p-4 text-emerald-700">{r.refundable}</td>
                      <td className="p-4 text-slate-600">{r.nonRefundable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white shadow-lift">
          <p className="font-display text-lg font-semibold">Need to cancel a booking?</p>
          <p className="mt-1 text-sm text-brand-100">Open the booking in My Trips and choose Cancel — the exact refund amount is shown before you confirm.</p>
          <Link to="/my-trips" className="mt-4 inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-card transition-transform hover:scale-[1.03]">
            Go to My Trips
          </Link>
        </div>
      </div>
    </div>
  )
}
