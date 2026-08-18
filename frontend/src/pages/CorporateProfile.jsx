import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BadgeCheck, Briefcase, Building2, CreditCard, Mail, MapPin, Phone, ShieldCheck, UserRound, Users,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function CorporateProfile() {
  const { user, isAuthenticated } = useAuth()

  const { data: policies, isLoading } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
  })

  if (!isAuthenticated) {
    return (
      <div className="container-x py-16">
        <EmptyState icon={UserRound} title="Sign in to view your profile" text="Your corporate profile and travel entitlement live here." action={<Button asChild><Link to="/login">Sign in</Link></Button>} />
      </div>
    )
  }

  const policy = policies?.find((p) => p.designation === user?.designation) || policies?.find((p) => p.grade === user?.grade)

  const ROWS = [
    { icon: UserRound, label: 'Employee ID', value: user?.employeeId },
    { icon: Briefcase, label: 'Designation', value: user?.designation },
    { icon: Building2, label: 'Department', value: user?.department },
    { icon: Users, label: 'Manager', value: user?.manager },
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone },
    { icon: MapPin, label: 'Base location', value: user?.location },
    { icon: CreditCard, label: 'Cost centre', value: user?.costCenter },
  ]

  return (
    <div className="bg-slate-50">
      <div className="container-x py-8">
        {/* Header card */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 shadow-lift">
          <div className="flex flex-wrap items-center gap-5 p-6 text-white sm:p-8">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white/15 font-display text-2xl font-bold ring-2 ring-white/30">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-semibold sm:text-3xl">{user?.firstName} {user?.lastName}</h1>
              <p className="mt-1 text-sm text-brand-100">{user?.designation} · {user?.department}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="bg-white/15 text-white ring-0">Grade {user?.grade}</Badge>
                <Badge className="bg-white/15 text-white ring-0">{user?.employeeId}</Badge>
                <Badge className="bg-white/15 text-white ring-0">{user?.company}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-brand-600" /> Employee details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROWS.map((r) => (
                  <div key={r.label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <r.icon className="size-4 shrink-0 text-brand-600" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{r.label}</p>
                      <p className="truncate text-sm font-bold text-slate-800">{r.value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policy */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 text-white">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-100">
                  <ShieldCheck className="size-4" /> Corporate travel policy
                </p>
                <p className="mt-2 font-display text-xl font-semibold">{user?.designation} · Grade {user?.grade}</p>
              </div>
              <CardContent className="p-5">
                {isLoading ? (
                  <Skeleton className="h-40 w-full rounded-xl" />
                ) : policy ? (
                  <div className="space-y-2.5 text-sm">
                    {[
                      { label: 'Flight class', value: policy.flightClass },
                      { label: 'Hotel category', value: `Up to ${policy.hotelStars}★` },
                      { label: 'Hotel limit', value: `₹${policy.hotelLimit?.toLocaleString('en-IN')}/night` },
                      { label: 'Daily allowance', value: `₹${policy.dailyAllowance?.toLocaleString('en-IN')}/day` },
                      { label: 'Advance booking', value: `≥ ${policy.advanceDays} days` },
                      { label: 'International', value: policy.international || 'Per policy' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-slate-500">{row.label}</span>
                        <span className="font-semibold text-slate-800">{row.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No policy configured for this designation.</p>
                )}
                <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
                  <BadgeCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  Selections above these limits are flagged during search and need approver justification.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="mb-3 text-sm font-bold text-slate-900">Travel stats</p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-slate-50 p-4"><p className="font-display text-2xl font-bold text-brand-700">3</p><p className="text-xs text-slate-500">Trips booked</p></div>
                  <div className="rounded-xl bg-slate-50 p-4"><p className="font-display text-2xl font-bold text-emerald-600">100%</p><p className="text-xs text-slate-500">Policy compliant</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
