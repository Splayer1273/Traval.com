import { Check, X, Clock, FileCheck2, Ticket, ShieldCheck, FilePlus2 } from 'lucide-react'
import { cn } from '../lib/utils.js'
import { formatDate } from '../utils/format.js'

const fmt = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const h = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(iso)} · ${h}`
}

/**
 * Approval workflow timeline for a travel request.
 *   ✓ Request created → ✓ Policy checked → manager decision →
 *   booking confirmation → ticket generated.
 */
export default function ApprovalTimeline({ request }) {
  const { status, approval, createdAt, rejectionReason } = request
  const policyTime = request.timeline?.find((t) => t.label.includes('Policy'))?.time || createdAt

  const steps = [
    { label: 'Request created', time: createdAt, icon: FilePlus2, done: true, tone: 'done' },
    { label: 'Policy checked', time: policyTime, icon: ShieldCheck, done: true, tone: request.policy?.violation ? 'warn' : 'done' },
    {
      label: status === 'rejected'
        ? 'Rejected by manager'
        : ['approved', 'ticketed', 'completed', 'cancelled'].includes(status)
          ? `Approved by ${approval?.decision === 'rejected' ? 'manager' : (request.approver?.name || 'manager')}`
          : 'Awaiting manager approval',
      time: approval?.at,
      icon: status === 'rejected' ? X : Clock,
      done: ['approved', 'ticketed', 'completed', 'cancelled'].includes(status),
      rejected: status === 'rejected',
      pending: status === 'pending',
      note: approval?.comment || rejectionReason,
    },
    {
      label: 'Booking confirmation',
      icon: FileCheck2,
      done: ['ticketed', 'completed'].includes(status),
      pending: ['pending', 'approved', 'rejected', 'cancelled'].includes(status),
    },
    {
      label: 'Ticket generated',
      icon: Ticket,
      done: ['ticketed', 'completed'].includes(status),
      pending: true,
    },
  ]

  if (status === 'cancelled') {
    steps.push({
      label: 'Request cancelled',
      time: request.updatedAt,
      icon: X,
      done: true,
      cancelled: true,
      note: request.cancelReason,
    })
  }

  return (
    <ol className="relative space-y-6">
      {steps.map((s, i) => {
        const last = i === steps.length - 1
        const isRejected = s.rejected
        const isCancelled = s.cancelled
        const isWaiting = s.pending && !s.done
        return (
          <li key={s.label} className="relative flex gap-4">
            {/* Connector */}
            {!last && (
              <span className={cn('absolute left-[15px] top-9 h-[calc(100%-24px)] w-0.5', s.done && !isRejected ? 'bg-emerald-300' : 'bg-slate-200')} />
            )}
            {/* Node */}
            <span
              className={cn(
                'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2',
                isRejected || isCancelled
                  ? 'border-rose-400 bg-rose-50 text-rose-600'
                  : s.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isWaiting
                      ? 'border-amber-400 bg-amber-50 text-amber-600'
                      : 'border-slate-300 bg-white text-slate-400',
              )}
            >
              {isRejected || isCancelled ? <X className="size-4" /> : s.done ? <Check className="size-4" /> : isWaiting ? <Clock className="size-4 animate-pulse" /> : <s.icon className="size-4" />}
            </span>
            <div className={cn('min-w-0 pt-0.5', isWaiting && 'opacity-80')}>
              <p className={cn('text-sm font-bold', isRejected || isCancelled ? 'text-rose-700' : s.done ? 'text-slate-800' : isWaiting ? 'text-amber-700' : 'text-slate-400')}>
                {s.label}
              </p>
              {s.time && <p className="text-xs text-slate-400">{fmt(s.time)}</p>}
              {s.note && (
                <p className={cn('mt-1 rounded-lg px-3 py-2 text-xs leading-relaxed', isRejected || isCancelled ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-500')}>
                  {s.note}
                </p>
              )}
              {isWaiting && <p className="mt-1 text-xs text-slate-400">Waiting</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
