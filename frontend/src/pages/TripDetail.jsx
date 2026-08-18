import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Briefcase, Building2, CalendarDays, Check, CheckCircle2, ClipboardList,
  Clock, Download, Hotel, Loader2, MapPin, Plane, Receipt, Ticket, Users, Wallet, XCircle,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog.jsx'
import { Price } from '../components/Price.jsx'
import ApprovalTimeline from '../components/ApprovalTimeline.jsx'
import { PolicyNotice } from '../components/PolicyBadge.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { requestStatusMeta } from '../data/corporate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate, formatTime, daysBetween } from '../utils/format.js'

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user, isApprover, isAdmin } = useAuth()
  const { toast, error } = useToast()
  const { refresh: refreshNotifs } = useNotifications()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState('')

  const { data: req, isLoading } = useQuery({
    queryKey: ['request', id],
    queryFn: () => corporateApi.getRequest(id),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['request', id] })
    qc.invalidateQueries({ queryKey: ['requests'] })
    refreshNotifs()
  }

  const approveMutation = useMutation({
    mutationFn: () => corporateApi.approveRequest(id),
    onSuccess: () => { toast('Request approved — the employee has been notified.', 'Approved'); invalidate() },
    onError: (e) => error(e.message, 'Approval failed'),
  })
  const rejectMutation = useMutation({
    mutationFn: () => corporateApi.rejectRequest(id, { comment: reason }),
    onSuccess: () => { toast('Request rejected with your reason.', 'Rejected'); setRejectOpen(false); setReason(''); invalidate() },
    onError: (e) => error(e.message, 'Rejection failed'),
  })
  const ticketMutation = useMutation({
    mutationFn: () => corporateApi.ticketRequest(id),
    onSuccess: () => { toast('Booking confirmed and e-ticket generated.', 'Ticketed'); invalidate() },
    onError: (e) => error(e.message, 'Ticketing failed'),
  })
  const cancelMutation = useMutation({
    mutationFn: () => corporateApi.cancelRequest(id, reason),
    onSuccess: () => { toast('Request cancelled.', 'Cancelled'); setCancelOpen(false); setReason(''); invalidate() },
    onError: (e) => error(e.message, 'Cancel failed'),
  })

  if (isLoading) return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>

  if (!req) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Request not found</p>
        <Button className="mt-4" asChild><Link to="/my-trips">Back to My Trips</Link></Button>
      </div>
    )
  }

  const meta = requestStatusMeta(req.status)
  const nights = daysBetween(req.startDate, req.endDate) || 1
  const canApprove = isApprover && req.status === 'pending'
  const canTicket = isApprover && ['approved'].includes(req.status)
  const canCancel = user?.id === req.employee?.id && ['pending', 'approved'].includes(req.status)
  const ticketable = ['ticketed', 'completed'].includes(req.status)

  return (
    <div className="bg-slate-50">
      <div className="container-x py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-500">{req.ref}</span>
              <Badge variant={meta.variant}>{meta.label}</Badge>
              {req.policy?.violation && <Badge variant="danger">Policy exception</Badge>}
            </div>
            <h1 className="mt-1.5 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{req.title}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="size-4 text-brand-600" /> {req.from} → {req.destination}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-brand-600" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canApprove && (
              <>
                <Button onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}>
                  {approveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Approve
                </Button>
                <Button variant="destructive" onClick={() => setRejectOpen(true)}><XCircle className="size-4" /> Reject</Button>
              </>
            )}
            {canTicket && (
              <Button variant="sun" onClick={() => ticketMutation.mutate()} disabled={ticketMutation.isPending}>
                {ticketMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Ticket className="size-4" />} Confirm & issue ticket
              </Button>
            )}
            {canCancel && (
              <Button variant="secondary" onClick={() => setCancelOpen(true)}><XCircle className="size-4" /> Cancel request</Button>
            )}
            {ticketable && (
              <>
                <Button variant="secondary" asChild><Link to={`/claims/new?trip=${id}`}><Receipt className="size-4" /> File expense claim</Link></Button>
                <Button variant="secondary" onClick={() => toast(`E-ticket for ${req.ref} downloaded.`, 'Download')}><Download className="size-4" /> E-ticket</Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Trip overview */}
            <Card>
              <CardContent className="p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Briefcase className="size-3.5" /> Purpose</p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800">{req.purpose}</p>
                    {req.client && <p className="mt-1 text-xs text-slate-500">Client: {req.client}</p>}
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Users className="size-3.5" /> Travellers</p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800">{req.travellers || 1}</p>
                    <p className="mt-1 text-xs text-slate-500">{req.employee?.department}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Building2 className="size-3.5" /> Costing</p>
                    <p className="mt-1.5 text-sm font-bold text-slate-800"><Price amount={req.estimatedCost} /></p>
                    <p className="mt-1 text-xs text-slate-500">{req.project ? `Project: ${req.project}` : ''} {req.costCenter ? `· CC: ${req.costCenter}` : ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Flight */}
            {req.flight && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plane className="size-5 text-brand-600" /> Flight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="min-w-28">
                      <p className="text-xl font-bold text-slate-900">{formatTime(req.flight.dep)}</p>
                      <p className="text-sm font-bold text-slate-700">{req.flight.from.code}</p>
                      <p className="text-xs text-slate-400">{formatDate(req.flight.dep)}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="relative my-1.5 h-0.5 w-full min-w-16 bg-slate-200">
                        <Plane className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-brand-500" />
                      </div>
                      <p className="text-[11px] text-slate-400">{req.flight.stops === 0 ? 'Non-stop' : `${req.flight.stops} stop`} · {req.flight.cabin}</p>
                    </div>
                    <div className="min-w-28 text-right">
                      <p className="text-xl font-bold text-slate-900">{formatTime(req.flight.arr)}</p>
                      <p className="text-sm font-bold text-slate-700">{req.flight.to.code}</p>
                      <p className="text-xs text-slate-400">{req.flight.airline} {req.flight.flightNumber}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    <Price amount={req.flight.price} /> per person · {req.flight.baggage} baggage · {req.flight.refundable ? 'refundable fare' : 'non-refundable fare'}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Hotel */}
            {req.hotel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Hotel className="size-5 text-brand-600" /> Hotel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-4">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Hotel className="size-5" /></span>
                      <div>
                        <p className="font-display text-base font-semibold text-slate-900">{req.hotel.name}</p>
                        <p className="text-xs text-slate-500">{req.hotel.city} · {'★'.repeat(req.hotel.star)} · {req.hotel.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800"><Price amount={req.hotel.pricePerNight} /> <span className="text-xs font-medium text-slate-400">/night</span></p>
                      <p className="text-xs text-slate-500">{req.hotel.nights} nights · <Price amount={req.hotel.total} /> incl. taxes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Policy — always evaluated against the request's traveller, not the viewer */}
            <PolicyNotice
              employee={req.employee}
              flight={req.flight ? { cabin: req.flight.cabin } : null}
              hotel={req.hotel ? { star: req.hotel.star, pricePerNight: req.hotel.pricePerNight } : null}
              room={{ price: req.hotel?.pricePerNight, nights: req.hotel?.nights }}
            />

            {/* Cost */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="size-5 text-brand-600" /> Estimated cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {req.flight && <div className="flex justify-between"><span className="text-slate-500">Flight ({req.flight.airline})</span><span className="font-semibold text-slate-800"><Price amount={req.flight.price * (req.travellers || 1)} /></span></div>}
                {req.hotel && <div className="flex justify-between"><span className="text-slate-500">Hotel · {req.hotel.nights} nights</span><span className="font-semibold text-slate-800"><Price amount={req.hotel.total} /></span></div>}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Total (billed to {req.company || 'company'})</span>
                  <Price amount={req.estimatedCost} className="text-xl font-bold text-slate-900" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Approval timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList className="size-5 text-brand-600" /> Approval status</CardTitle>
              </CardHeader>
              <CardContent>
                <ApprovalTimeline request={req} />
              </CardContent>
            </Card>

            {/* Employee */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="size-5 text-brand-600" /> Traveller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                    {req.employee?.name?.[0] || 'T'}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{req.employee?.name}</p>
                    <p className="text-xs text-slate-500">{req.employee?.employeeId} · {req.employee?.designation}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 text-xs">
                  <p className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-semibold text-slate-700">{req.employee?.department}</span></p>
                  <p className="mt-1.5 flex justify-between"><span className="text-slate-500">Travel grade</span><span className="font-semibold text-slate-700">Grade {req.employee?.grade}</span></p>
                  <p className="mt-1.5 flex justify-between"><span className="text-slate-500">Approver</span><span className="font-semibold text-slate-700">{req.approver?.name || 'Manager'}</span></p>
                </div>
                {req.approval && (
                  <p className="flex items-start gap-1.5 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
                    {req.approval.comment ? `Decision: ${req.approval.comment}` : 'Decision recorded.'}
                  </p>
                )}
              </CardContent>
            </Card>

            {req.status === 'pending' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-800">
                <p className="flex items-center gap-1.5 font-bold"><Clock className="size-3.5" /> Awaiting manager approval</p>
                <p className="mt-1">You'll be notified as soon as {req.approver?.name || 'your manager'} reviews this request.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject travel request</DialogTitle>
            <DialogDescription>
              {req.employee?.name}'s trip to {req.destination} — <Price amount={req.estimatedCost} />. Add the reason so the employee can revise the request.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">Reason for rejection</p>
            <Textarea rows={3} placeholder="e.g. Travel dates need to be changed." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={rejectMutation.isPending || !reason.trim()} onClick={() => rejectMutation.mutate()}>
              {rejectMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />} Reject request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel modal */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel travel request</DialogTitle>
            <DialogDescription>
              This cancels request {req.ref}. Add an optional reason — your approver will be notified.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">Reason (optional)</p>
            <Textarea rows={2} placeholder="e.g. Client meeting postponed." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCancelOpen(false)}>Keep request</Button>
            <Button variant="destructive" disabled={cancelMutation.isPending} onClick={() => cancelMutation.mutate()}>
              {cancelMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />} Cancel request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
