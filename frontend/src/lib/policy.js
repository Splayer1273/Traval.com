import { CABIN_ORDER, policyForDesignation } from '../data/corporate.js'
import { corporateApi } from '../services/corporateApi.js'
import { formatMoney } from '../utils/format.js'

/**
 * Corporate travel policy engine.
 *
 * Every flight and hotel selection is checked against the employee's
 * designation-based policy. Results carry a human-readable explanation so
 * the UI can say WHY something is out of policy instead of just showing a
 * red badge.
 *
 * Status vocabulary:
 *   'within'   — fully compliant with company policy
 *   'outside'  — exceeds an allowance (hotel star / price) — needs justification
 *   'violation'— not permitted at all (e.g. business class for a Grade B role)
 */

export function allowedFlightClasses(policy) {
  if (!policy) return ['Economy']
  const classes = ['Economy']
  if (policy.premiumEconomy) classes.push('Premium Economy')
  if (policy.business) classes.push('Business')
  return classes
}

function classRank(cabin) {
  const idx = CABIN_ORDER.indexOf(cabin)
  return idx === -1 ? 0 : idx
}

/** Resolve the live (admin-editable) policy for an employee. */
export async function getPolicyForEmployee(employee) {
  const policies = await corporateApi.getPolicies()
  const designation = employee?.designation || 'Executive'
  return (
    policies.find((p) => p.designation === designation) ||
    policies.find((p) => p.grade === employee?.grade) ||
    policyForDesignation(designation)
  )
}

/** Synchronous variant when the policy list is already loaded. */
export function policyForEmployee(employee, policies) {
  const list = Array.isArray(policies) && policies.length ? policies : null
  const designation = employee?.designation || 'Executive'
  return (
    list?.find((p) => p.designation === designation) ||
    list?.find((p) => p.grade === employee?.grade) ||
    policyForDesignation(designation)
  )
}

/** Check a flight against the employee's policy. */
export function checkFlightPolicy(employee, flight, policies) {
  const policy = policyForEmployee(employee, policies)
  const allowed = allowedFlightClasses(policy)
  const issues = []

  if (classRank(flight?.cabin) > classRank(allowed[allowed.length - 1])) {
    issues.push({
      level: 'violation',
      text: `${policy.designation} designation — ${allowed.join(' / ')} class is permitted. ${flight.cabin} requires special (exception) approval.`,
    })
  }
  if (issues.length) return { status: 'violation', issues, policy }
  return { status: 'within', issues, policy }
}

/** Check a hotel + room against the employee's policy. */
export function checkHotelPolicy(employee, hotel, room, policies) {
  const policy = policyForEmployee(employee, policies)
  const issues = []
  const roomPrice = room?.price ?? hotel?.pricePerNight ?? 0
  const nights = room?.nights || 1

  if ((hotel?.star || 0) > (policy.hotelStars || 5)) {
    issues.push({
      level: 'outside',
      text: `Hotel category above your allowance — up to ${policy.hotelStars}★ permitted for ${policy.designation}, selected ${hotel.star}★.`,
    })
  }
  if (roomPrice > (policy.hotelLimit || Infinity)) {
    const diff = roomPrice - policy.hotelLimit
    issues.push({
      level: 'outside',
      text: `Above your hotel limit — allowed ${formatMoney(policy.hotelLimit)}/night, selected ${formatMoney(roomPrice)}/night, difference ${formatMoney(diff)}/night (${formatMoney(diff * nights)} for the stay).`,
    })
  }
  if (issues.length) return { status: 'outside', issues, policy, allowed: policy.hotelLimit, selected: roomPrice, diff: roomPrice - policy.hotelLimit }
  return { status: 'within', issues, policy, allowed: policy.hotelLimit, selected: roomPrice, diff: 0 }
}

/** Combined check for a request draft. */
export function checkTravelPlan(employee, draft, policies) {
  const flight = checkFlightPolicy(employee, draft?.flight, policies)
  const hotel = draft?.hotel && draft.room
    ? checkHotelPolicy(employee, draft.hotel, draft.room, policies)
    : { status: 'none', issues: [], policy: null }
  const statuses = [flight.status, hotel.status]
  const violation = statuses.includes('violation') || statuses.includes('outside')
  const worst =
    statuses.includes('violation') ? 'violation'
      : statuses.includes('outside') ? 'outside'
        : statuses.includes('none') && statuses.every((s) => s === 'none') ? 'none'
          : 'within'
  return {
    flight,
    hotel,
    violation,
    worst,
    status: worst,
    issues: [...flight.issues, ...hotel.issues],
  }
}

/** Short label + tone for a policy status. */
export const POLICY_STATUS_META = {
  within: { label: 'Within Policy', variant: 'success', icon: 'check' },
  outside: { label: 'Outside Policy', variant: 'warning', icon: 'alert' },
  violation: { label: 'Policy Violation', variant: 'danger', icon: 'x' },
  none: { label: 'Not Applicable', variant: 'secondary', icon: 'minus' },
}
