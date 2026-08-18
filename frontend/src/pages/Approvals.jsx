import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BadgeCheck, Briefcase, Building2, CalendarDays, Check, ClipboardList, Clock, Hotel,
  Loader2, MapPin, Plane, Users, Wallet, XCircle,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Price } from '../components/Price.jsx'
import { PolicyBadge } from '../components/PolicyBadge.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { requestStatusMeta } from '../data/corporate.js'
import { useNotifications } from '../context/NotificationContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate } from '../utils/format.js'
import { cn } from '../lib/utils.js'

function RejectDialog({ open, onOpenChange, request, onReject, pending }) {
  const [reason, setReason] = useState('')
  useEffect(() => {
    if (open) setReason('')
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject travel request</DialogTitle>
          <DialogDescription>
            {request?.employee?.name}'s trip to {request?.destination} — <Price amount={request?.estimatedCost} />. The employee will see this reason.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-600">Reason for rejection</p>
          <Textarea rows={3} placeholder="e.g. Travel dates need to be changed." value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" disabled={pending || !reason.trim()} onClick={() => onReject(reason)}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />} Reject request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RequestRow({ req, onApprove, onReject, busy }) {
  const meta = requestStatusMeta(req.status)
  const Info = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <Icon className="size-3.5 shrink-0 text-slate-400" />
      <span className="text-slate-400">{label}:</span>
      <span className="font-semibold text-slate-700">{value}</span>
    </div>
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:border-brand-300 hover:shadow-lift">
      <div className="grid lg:grid-cols-[1fr_auto]">
        <div className="p-4 sm:p-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                {req.employee?.name?.[0] || 'E'}
              </span>
              <div>
                <p className="font-display text-base font-semibold text-slate-900">{req.employee?.name}</p>
                <p className="text-xs text-slate-500">{req.employee?.employeeId} · {req.employee?.designation} · {req.employee?.department}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PolicyBadge
                employee={{ designation: req.employee?.designation, grade: req.employee?.grade }}
                flight={req.flight ? { cabin: req.flight.cabin } : null}
                hotel={req.hotel ? { star: req.hotel.star } : null}
                room={{ price: req.hotel?.pricePerNight }}
              />
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>
          </div>

          {/* Trip summary */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><MapPin className="size-3.5" /> Destination</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{req.from} → {req.destination}</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-500"><CalendarDays className="size-3.5" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Briefcase className="size-3.5" /> Purpose</p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800">{req.purpose}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Plane className="size-3.5" /> Flight</p>
              {req.flight ? (
                <p className="mt-1 text-sm font-bold text-slate-800">{req.flight.airline} {req.flight.flightNumber}</p>
              ) : <p className="mt-1 text-sm text-slate-400">Not selected</p>}
              {req.hotel && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Hotel className="size-3" /> {req.hotel.name}</p>}
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Wallet className="size-3.5" /> Estimated cost</p>
              <p className="mt-1 text-lg font-bold text-slate-900"><Price amount={req.estimatedCost} /></p>
              <p className="text-[11px] text-slate-400">{req.travellers || 1} traveller · {req.project || 'no project code'}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            <Info icon={Users} label="Approver" value={req.approver?.name || '—'} />
            <Info icon={Building2} label="Company" value={req.company} />
            {req.policy?.violation && <Info icon={Clock} label="Note" value="Policy exception — review justification" />}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 p-4 lg:w-56 lg:flex-col lg:items-stretch lg:border-l lg:border-t-0 lg:justify-center">
          {req.status === 'pending' ? (
            <>
              <Button className="flex-1 lg:w-full" onClick={() => onApprove(req)} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Approve
              </Button>
              <Button variant="destructive" className="flex-1 lg:w-full" onClick={() => onReject(req)} disabled={busy}>
                <XCircle className="size-4" /> Reject
              </Button>
            </>
          ) : (
            <Button variant="secondary" asChild><Link to={`/trips/${req.id}`}><ClipboardList className="size-4" /> View request</Link></Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Approvals() {
  const qc = useQueryClient()
  const { toast, error } = useToast()
  const { refresh: refreshNotifs } = useNotifications()
  const [filter, setFilter] = useState('pending')
  const [rejectTarget, setRejectTarget] = useState(null)

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'approvals'],
    queryFn: () => corporateApi.getRequests({}),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['requests'] })
    refreshNotifs()
  }

  const approveMutation = useMutation({
    mutationFn: (id) => corporateApi.approveRequest(id),
    onSuccess: (req) => { toast(`Request ${req.ref} approved — ${req.employee?.name} notified.`, 'Approved'); invalidate() },
    onError: (e) => error(e.message, 'Approval failed'),
  })
  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }) => corporateApi.rejectRequest(id, { comment }),
    onSuccess: () => { toast('Request rejected with your reason.', 'Rejected'); setRejectTarget(null); invalidate() },
    onError: (e) => error(e.message, 'Rejection failed'),
  })

  const list = (requests || []).filter((r) => filter === 'all' || r.status === filter)
  const counts = (requests || []).reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }), {})

  const TABS = [
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'ticketed', label: 'Ticketed' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'all', label: 'All' },
  ]

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <ClipboardList className="size-4 text-brand-600" /> Approval queue
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Travel approvals</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Review each request — purpose, itinerary, policy compliance and cost — before approving or rejecting.
          </p>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
                  filter === t.id ? 'bg-brand-600 text-white shadow-soft' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300',
                )}
              >
                {t.label}
                <span className={cn('ml-1.5 rounded-full px-1.5 text-[11px] font-bold', filter === t.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500')}>
                  {counts[t.id] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-52 w-full rounded-2xl" />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={BadgeCheck}
            title={filter === 'pending' ? 'All caught up 🎉' : `No ${filter} requests`}
            text={filter === 'pending' ? 'No travel requests are waiting for your approval right now.' : 'There are no requests in this state.'}
          />
        ) : (
          <div className="space-y-4">
            {list.map((req) => (
              <RequestRow
                key={req.id}
                req={req}
                busy={approveMutation.isPending || rejectMutation.isPending}
                onApprove={(r) => approveMutation.mutate(r.id)}
                onReject={(r) => setRejectTarget(r)}
              />
            ))}
          </div>
        )}
      </div>

      <RejectDialog
        open={!!rejectTarget}
        onOpenChange={(o) => { if (!o) setRejectTarget(null) }}
        request={rejectTarget}
        pending={rejectMutation.isPending}
        onReject={(reason) => rejectMutation.mutate({ id: rejectTarget.id, comment: reason })}
      />
    </div>
  )
}
