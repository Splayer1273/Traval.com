import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Banknote, Check, CheckCircle2, Loader2, Receipt, Plus, Wallet, XCircle,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog.jsx'
import { Price } from '../components/Price.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { claimStatusMeta, claimCategoryMeta } from '../data/corporate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate } from '../utils/format.js'
import { cn } from '../lib/utils.js'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'reimbursed', label: 'Reimbursed' },
  { id: 'rejected', label: 'Rejected' },
]

function StatCard({ icon: Icon, label, value, tone = 'text-brand-600' }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4 sm:p-5">
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50', tone)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{value}</p>
          <p className="truncate text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ClaimCard({ claim, isReviewer, onApprove, onReject, onReimburse, onWithdraw, busy }) {
  const meta = claimStatusMeta(claim.status)
  const cat = claimCategoryMeta(claim.category)
  const claimant = claim.employee
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">{cat.emoji}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-base font-semibold text-slate-900">{cat.label} · <Price amount={claim.amount} /></p>
              <Badge variant={meta.variant}>{meta.label}</Badge>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {claim.merchant || claim.description || '—'}
              {claim.spentOn ? ` · ${formatDate(claim.spentOn)}` : ''}
            </p>
            {claim.tripRef && (
              <p className="mt-1 text-xs">
                {claim.tripId ? (
                  <Link to={`/trips/${claim.tripId}`} className="font-semibold text-brand-700 hover:underline">
                    {claim.tripRef} · {claim.tripTitle || claim.destination}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-600">{claim.tripRef || claim.tripTitle}</span>
                )}
              </p>
            )}
            {isReviewer && claimant && (
              <p className="mt-1 text-xs text-slate-500">
                {claimant.name} · {claimant.designation} · {claimant.department}
              </p>
            )}
            {claim.reviewNote && (
              <p className={cn('mt-2 rounded-lg px-3 py-2 text-xs', claim.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600')}>
                {claim.reviewedBy && <span className="font-semibold">{claim.reviewedBy}: </span>}
                {claim.reviewNote}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {claim.status === 'pending' && isReviewer && (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => onReject(claim)} disabled={busy}>
                <XCircle className="size-3.5" /> Reject
              </Button>
              <Button size="sm" onClick={() => onApprove(claim)} disabled={busy}>
                {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />} Approve
              </Button>
            </div>
          )}
          {claim.status === 'approved' && isReviewer && (
            <Button size="sm" variant="sun" onClick={() => onReimburse(claim)} disabled={busy}>
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Banknote className="size-3.5" />} Mark reimbursed
            </Button>
          )}
          {claim.status === 'pending' && !isReviewer && (
            <Button size="sm" variant="outline" onClick={() => onWithdraw(claim)} disabled={busy}>
              Withdraw claim
            </Button>
          )}
          {claim.reimbursedAt && (
            <p className="flex items-center gap-1 text-[11px] text-slate-400">
              <CheckCircle2 className="size-3.5 text-emerald-500" /> Paid {formatDate(claim.reimbursedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Claims() {
  const { user, isFinance, isAdmin } = useAuth()
  const isReviewer = isFinance || isAdmin
  const qc = useQueryClient()
  const { toast, error } = useToast()
  const { refresh: refreshNotifs } = useNotifications()
  const [tab, setTab] = useState('pending')
  const [rejectTarget, setRejectTarget] = useState(null)
  const [reason, setReason] = useState('')

  const { data: claims, isLoading } = useQuery({
    queryKey: ['claims', user?.id],
    queryFn: () => corporateApi.getClaims(),
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['claims'] })
    refreshNotifs()
  }

  const approveMutation = useMutation({
    mutationFn: (id) => corporateApi.reviewClaim(id, { status: 'approved' }),
    onSuccess: () => { toast('Claim approved — the employee has been notified.', 'Approved'); invalidate() },
    onError: (e) => error(e.message, 'Approval failed'),
  })
  const rejectMutation = useMutation({
    mutationFn: (id) => corporateApi.reviewClaim(id, { status: 'rejected', note: reason }),
    onSuccess: () => { toast('Claim rejected with your note.', 'Rejected'); setRejectTarget(null); setReason(''); invalidate() },
    onError: (e) => error(e.message, 'Rejection failed'),
  })
  const reimburseMutation = useMutation({
    mutationFn: (id) => corporateApi.reviewClaim(id, { status: 'reimbursed' }),
    onSuccess: () => { toast('Claim marked as reimbursed.', 'Reimbursed'); invalidate() },
    onError: (e) => error(e.message, 'Reimbursement failed'),
  })
  const withdrawMutation = useMutation({
    mutationFn: (id) => corporateApi.withdrawClaim(id),
    onSuccess: () => { toast('Claim withdrawn.', 'Withdrawn'); invalidate() },
    onError: (e) => error(e.message, 'Withdraw failed'),
  })

  const list = claims || []
  const pending = list.filter((c) => c.status === 'pending')
  const approved = list.filter((c) => c.status === 'approved')
  const reimbursed = list.filter((c) => c.status === 'reimbursed')
  const rejected = list.filter((c) => c.status === 'rejected')
  const totalClaimed = list.filter((c) => c.status !== 'rejected').reduce((s, c) => s + c.amount, 0)
  const pendingValue = pending.reduce((s, c) => s + c.amount, 0)

  const visible = list.filter((c) => (tab === 'all' ? true : c.status === tab))
  // Reviewers see pending claims first; employees keep newest first.
  const ordered = isReviewer ? [...visible].sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1)) : visible

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Receipt className="size-4 text-brand-600" /> {isReviewer ? 'Expense claims' : 'Expense reimbursement'}
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                {isReviewer ? 'Claims to review' : 'My expense claims'}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {isReviewer
                  ? 'Review claims filed against completed trips, verify the details and approve or reject with a note.'
                  : 'Claim expenses for ticketed and completed business trips — finance reviews each claim before reimbursement.'}
              </p>
            </div>
            {!isReviewer && (
              <Button asChild><Link to="/my-trips?tab=completed"><Plus className="size-4" /> Submit a claim</Link></Button>
            )}
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Receipt} label={isReviewer ? 'Pending claims' : 'My pending claims'} value={pending.length} tone="text-amber-600" />
          <StatCard icon={Banknote} label="Pending value" value={<Price amount={pendingValue} />} tone="text-brand-600" />
          <StatCard icon={CheckCircle2} label="Approved / reimbursed" value={approved.length + reimbursed.length} tone="text-emerald-600" />
          <StatCard icon={Wallet} label="Total claimed" value={<Price amount={totalClaimed} />} tone="text-slate-600" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-soft scrollbar-hide">
          {TABS.map((t) => {
            const count = t.id === 'all' ? list.length : t.id === 'pending' ? pending.length : t.id === 'approved' ? approved.length : t.id === 'reimbursed' ? reimbursed.length : rejected.length
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all',
                  tab === t.id ? 'bg-brand-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {t.label}
                <span className={cn('rounded-full px-1.5 text-[10px] font-bold', tab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500')}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}</div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={isReviewer ? 'No claims in this view' : 'No claims yet'}
              text={isReviewer ? 'When employees file claims on completed trips, they appear here for review.' : 'File claims against your ticketed and completed trips — they show up here once submitted.'}
            />
          ) : (
            <div className="space-y-3">
              {ordered.map((c) => (
                <ClaimCard
                  key={c.id}
                  claim={c}
                  isReviewer={isReviewer}
                  busy={approveMutation.isPending || rejectMutation.isPending || reimburseMutation.isPending || withdrawMutation.isPending}
                  onApprove={(claim) => approveMutation.mutate(claim.id)}
                  onReject={(claim) => { setRejectTarget(claim); setReason('') }}
                  onReimburse={(claim) => reimburseMutation.mutate(claim.id)}
                  onWithdraw={(claim) => withdrawMutation.mutate(claim.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reject modal */}
      <Dialog open={!!rejectTarget} onOpenChange={(o) => { if (!o) setRejectTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject expense claim</DialogTitle>
            <DialogDescription>
              {rejectTarget ? (
                <>
                  {rejectTarget.employee?.name || 'Employee'}'s {claimCategoryMeta(rejectTarget.category).label.toLowerCase()} claim of{' '}
                  <Price amount={rejectTarget.amount} /> — {rejectTarget.tripRef || rejectTarget.tripTitle || ''}. Add a note so the employee can revise or re-file.
                </>
              ) : 'Add a note for the employee.'}
            </DialogDescription>
          </DialogHeader>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-600">Reason for rejection</p>
            <Textarea rows={3} placeholder="e.g. Missing receipt — please upload a copy." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="destructive" disabled={rejectMutation.isPending || !reason.trim()} onClick={() => rejectTarget && rejectMutation.mutate(rejectTarget.id)}>
              {rejectMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />} Reject claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
