import { useQuery } from '@tanstack/react-query'
import { BadgeCheck, AlertTriangle, XCircle, ShieldAlert, Info } from 'lucide-react'
import { corporateApi } from '../services/corporateApi.js'
import { checkFlightPolicy, checkHotelPolicy, POLICY_STATUS_META } from '../lib/policy.js'
import { useAuth } from '../context/AuthContext.jsx'
import { cn } from '../lib/utils.js'

function usePolicies() {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
    // Guests have no employee context — don't hit the protected endpoint.
    enabled: isAuthenticated,
  })
}

const STATUS_ICON = {
  within: BadgeCheck,
  outside: AlertTriangle,
  violation: XCircle,
  none: Info,
}

/**
 * Compact status badge — "Within Policy" / "Outside Policy" / "Policy Violation".
 * Renders nothing for guests (no employee context) or when there's no item.
 */
export function PolicyBadge({ employee, flight, hotel, room, className, showLabel = true }) {
  const { user, isAuthenticated } = useAuth()
  const { data: policies } = usePolicies()
  const emp = employee || (isAuthenticated ? user : null)
  if (!emp) return null

  const result = flight
    ? checkFlightPolicy(emp, flight, policies)
    : checkHotelPolicy(emp, hotel, room, policies)
  if (!result || result.status === 'none') return null

  const meta = POLICY_STATUS_META[result.status]
  const Icon = STATUS_ICON[result.status]
  const tone =
    result.status === 'within' ? 'text-emerald-600'
      : result.status === 'outside' ? 'text-amber-600'
        : 'text-rose-600'

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', className)}
      title={result.issues.map((i) => i.text).join('\n')}
    >
      <Icon className={cn('size-3.5', tone)} />
      {showLabel && <span className={cn(tone)}>{meta.label}</span>}
    </span>
  )
}

/**
 * Full-width policy notice with explanation(s) — used on detail, review and
 * trip pages so the employee always knows WHY something is (not) compliant.
 */
export function PolicyNotice({ employee, flight, hotel, room, className, compact = false }) {
  const { user, isAuthenticated } = useAuth()
  const { data: policies } = usePolicies()
  const emp = employee || (isAuthenticated ? user : null)
  if (!emp) return null

  const flightCheck = flight ? checkFlightPolicy(emp, flight, policies) : null
  const hotelCheck = hotel ? checkHotelPolicy(emp, hotel, room, policies) : null
  const checks = [flightCheck, hotelCheck].filter(Boolean)
  if (!checks.length) return null

  const statuses = checks.map((c) => c.status)
  const worst = statuses.includes('violation') ? 'violation' : statuses.includes('outside') ? 'outside' : 'within'
  const meta = POLICY_STATUS_META[worst]
  const Icon = STATUS_ICON[worst]

  const toneBg =
    worst === 'within' ? 'border-emerald-200 bg-emerald-50/70'
      : worst === 'outside' ? 'border-amber-200 bg-amber-50/70'
        : 'border-rose-200 bg-rose-50/70'
  const toneText =
    worst === 'within' ? 'text-emerald-800'
      : worst === 'outside' ? 'text-amber-800'
        : 'text-rose-800'

  return (
    <div className={cn('rounded-2xl border p-4', toneBg, className)}>
      <p className={cn('flex items-center gap-2 font-bold', toneText, compact ? 'text-sm' : 'text-sm sm:text-base')}>
        <Icon className="size-4.5 shrink-0" />
        {worst === 'within'
          ? 'Within corporate policy'
          : worst === 'outside'
            ? 'Outside corporate policy — needs justification'
            : 'Policy violation — requires exception approval'}
        <span className={cn('ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold', toneBg)}>{meta.label}</span>
      </p>
      {worst !== 'within' && (
        <ul className="mt-2 space-y-1.5">
          {checks.flatMap((c) => c.issues).map((issue, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              <span>{issue.text}</span>
            </li>
          ))}
        </ul>
      )}
      {worst === 'within' && flightCheck?.policy && (
        <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
          {flightCheck.policy.designation} grade · max {flightCheck.policy.flightClass} cabin · hotel up to{' '}
          ₹{flightCheck.policy.hotelLimit?.toLocaleString('en-IN')}/night · {flightCheck.policy.hotelStars}★
        </p>
      )}
    </div>
  )
}
