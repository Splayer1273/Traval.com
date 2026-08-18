import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Briefcase, CalendarDays, Loader2, MapPin, Receipt, Send } from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { CLAIM_CATEGORIES } from '../data/corporate.js'
import { useToast } from '../context/ToastContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { formatDate, todayISO } from '../utils/format.js'

export default function SubmitClaim() {
  const [params] = useSearchParams()
  const tripId = params.get('trip')
  const navigate = useNavigate()
  const { toast, error } = useToast()
  const { refresh: refreshNotifs } = useNotifications()

  const { data: req, isLoading } = useQuery({
    queryKey: ['request', tripId],
    queryFn: () => corporateApi.getRequest(tripId),
    enabled: !!tripId,
  })

  const [form, setForm] = useState({
    category: '',
    amount: '',
    spentOn: todayISO(),
    merchant: '',
    receipts: '1',
    description: '',
  })

  const submit = useMutation({
    mutationFn: () =>
      corporateApi.createClaim({
        trip: tripId,
        category: form.category,
        amount: Number(form.amount),
        spentOn: form.spentOn,
        merchant: form.merchant,
        receipts: Number(form.receipts) || 0,
        description: form.description,
      }),
    onSuccess: () => {
      refreshNotifs()
      toast('Claim submitted — finance has been notified for review.', 'Claim filed')
      navigate('/claims')
    },
    onError: (e) => error(e.message, 'Submission failed'),
  })

  const claimable = !!req && ['ticketed', 'completed'].includes(req.status)
  const amountInvalid = Number(form.amount) <= 0

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Receipt className="size-4 text-brand-600" /> Expense reimbursement
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Submit expense claim</h1>
          <p className="mt-2 text-sm text-slate-500">
            Claim out-of-pocket costs for a ticketed or completed business trip. Finance reviews every claim before reimbursement.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            ) : !req ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-800">
                <p className="font-bold">Select a trip to claim against</p>
                <p className="mt-1">Claims can only be filed against ticketed or completed trips.</p>
                <Button className="mt-4" variant="secondary" asChild><Link to="/my-trips?tab=completed">Browse completed trips</Link></Button>
              </div>
            ) : !claimable ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-800">
                <p className="font-bold">This trip isn't claimable yet</p>
                <p className="mt-1">
                  {req.title} is currently <span className="font-semibold capitalize">{req.status}</span>. Claims can be filed once a trip is{' '}
                  <span className="font-semibold">ticketed</span> or <span className="font-semibold">completed</span>.
                </p>
                <Button className="mt-4" variant="secondary" asChild><Link to={`/trips/${req.id}`}>Back to request</Link></Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Claim details</p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label>Expense category</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a category" /></SelectTrigger>
                        <SelectContent>
                          {CLAIM_CATEGORIES.map((c) => (
                            <SelectItem key={c.id} value={c.id}><span className="mr-2">{c.emoji}</span>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Amount (₹)</Label>
                      <Input type="number" min="1" className="mt-1.5" placeholder="e.g. 2450" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                    </div>
                    <div>
                      <Label>Date of expense</Label>
                      <Input type="date" className="mt-1.5" value={form.spentOn} max={todayISO()} onChange={(e) => setForm({ ...form, spentOn: e.target.value })} />
                    </div>
                    <div>
                      <Label>Merchant / vendor</Label>
                      <Input className="mt-1.5" placeholder="e.g. Uber India, Taj Restaurant" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
                    </div>
                    <div>
                      <Label>Number of receipts</Label>
                      <Input type="number" min="0" className="mt-1.5" value={form.receipts} onChange={(e) => setForm({ ...form, receipts: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea rows={3} className="mt-1.5" placeholder="What was this expense for? e.g. Lunch with client at the workshop venue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Note:</span> attach receipts to your claim for faster approval. Submitted claims cannot be edited — withdraw and re-file if you made a mistake.
                  </p>
                  <Button
                    disabled={submit.isPending || !form.category || amountInvalid}
                    onClick={() => submit.mutate()}
                  >
                    {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Submit for review
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trip context */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-200">Claiming against</p>
              {req ? (
                <>
                  <p className="mt-1 font-display text-lg font-semibold">{req.title}</p>
                  <p className="mt-0.5 text-xs text-brand-100">{req.ref} · <Badge className="bg-white/15 text-white ring-0">{req.status}</Badge></p>
                </>
              ) : (
                <p className="mt-1 text-sm text-brand-100">Select a ticketed or completed trip</p>
              )}
            </div>
            {req && (
              <CardContent className="space-y-2.5 p-5 text-sm">
                <p className="flex items-center gap-2 text-slate-600"><MapPin className="size-4 text-brand-600" /> {req.from} → {req.destination}</p>
                <p className="flex items-center gap-2 text-slate-600"><CalendarDays className="size-4 text-brand-600" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}</p>
                <p className="flex items-center gap-2 text-slate-600"><Briefcase className="size-4 text-brand-600" /> {req.purpose}</p>
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Flights, hotels and pre-booked transport are billed directly to the company — claim only out-of-pocket expenses.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
