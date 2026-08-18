import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, Banknote, Briefcase, Building2, CalendarDays, CheckCircle2, ClipboardList,
  Clock, Hotel, MapPin, Plane, Receipt, ShieldCheck, Sparkles, Users, Wallet, XCircle,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { Price } from '../components/Price.jsx'
import { corporateApi, computeStats } from '../services/corporateApi.js'
import { AIRPORTS } from '../data/airports.js'
import { requestStatusMeta, claimStatusMeta } from '../data/corporate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate, todayISO } from '../utils/format.js'
import { cn } from '../lib/utils.js'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ---------------------------------- Guest landing ---------------------------------- */

function GuestLanding() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ from: 'BOM', to: 'BLR', date: todayISO(14), returnDate: todayISO(17) })

  const searchFlight = (e) => {
    e.preventDefault()
    navigate(`/flights?trip=roundtrip&from=${form.from}&to=${form.to}&date=${form.date}&return=${form.returnDate}&cabin=Economy&corp=1`)
  }
  const searchHotel = () => navigate(`/hotels?destination=${AIRPORTS.find((a) => a.code === form.to)?.city || form.to}&checkIn=${form.date}&checkOut=${form.returnDate}&corp=1`)

  const FEATURES = [
    { icon: ShieldCheck, title: 'Policy-compliant booking', text: 'Every flight & hotel is checked against your company travel policy before you book.' },
    { icon: ClipboardList, title: 'Built-in approval workflow', text: 'Requests flow to your manager with purpose, cost and policy status attached.' },
    { icon: Wallet, title: 'Controlled company spend', text: 'Designation-based limits, budgets and a live view of estimated travel spend.' },
    { icon: Building2, title: 'Enterprise travel console', text: 'Admin dashboards for policies, employees, approvals and spend analytics.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-950 to-slate-900" />
        <div className="pointer-events-none absolute -left-24 top-8 size-80 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/3 size-96 rounded-full bg-sun-500/15 blur-3xl" />
        <div className="container-x relative flex min-h-[520px] flex-col justify-center py-16">
          <div className="mx-auto w-full max-w-3xl text-center text-white">
            <p className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              <Building2 className="size-3.5 text-sun-400" /> Corporate Travel Management · Acme Technologies
            </p>
            <h1 className="animate-fade-up font-display text-4xl font-semibold leading-tight sm:text-5xl" style={{ animationDelay: '80ms' }}>
              Manage your business travel.
              <br />
              <span className="text-gradient">Policy-first. Approval-ready.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base text-slate-300" style={{ animationDelay: '160ms' }}>
              Book flights and hotels for official trips, stay within company policy and let your manager approve in a few clicks.
            </p>
            <div className="mt-7 flex animate-fade-up flex-wrap items-center justify-center gap-3" style={{ animationDelay: '220ms' }}>
              <Button size="lg" onClick={() => navigate('/login')}><Plane className="size-4" /> Sign in to book</Button>
              <Button size="lg" variant="secondary" className="bg-white/10 text-white border-white/25 hover:bg-white/20" onClick={() => navigate('/register')}>
                Request an account
              </Button>
            </div>
          </div>

          {/* Business trip search */}
          <form onSubmit={searchFlight} className="mx-auto mt-10 w-full max-w-4xl animate-fade-up rounded-2xl border border-white/15 bg-white/95 p-4 shadow-lift backdrop-blur sm:p-5" style={{ animationDelay: '280ms' }}>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <Briefcase className="size-4 text-brand-600" /> Plan your next business trip
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Select value={form.from} onValueChange={(v) => setForm({ ...form, from: v })}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="From" /></SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
                <SelectTrigger className="bg-white"><SelectValue placeholder="To" /></SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                </SelectContent>
              </Select>
              <input type="date" value={form.date} min={todayISO()} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800" />
              <input type="date" value={form.returnDate} min={form.date || todayISO()} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800" />
              <Button type="submit" className="h-11"><Plane className="size-4" /> Search flights</Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={searchHotel} className="text-xs font-semibold text-brand-700 hover:underline">
                <Hotel className="mr-1 inline size-3.5" /> Need a hotel at {AIRPORTS.find((a) => a.code === form.to)?.city || form.to}?
              </button>
              <span className="ml-auto text-[11px] text-slate-400">Search is a preview — sign in to submit requests.</span>
            </div>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <CardContent className="p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-600">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="container-x pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 p-8 shadow-lift sm:p-12">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl text-white">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sun-300">
                <Sparkles className="size-4" /> For your company
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
                Travel policy, approvals and spend — in one place
              </h2>
              <p className="mt-3 text-sm text-brand-100">
                Employees book within policy, managers approve with full context, and admins control limits, departments and analytics.
              </p>
            </div>
            <Button size="lg" variant="secondary" className="bg-white text-brand-700 hover:bg-brand-50" onClick={() => navigate('/login')}>
              Explore the demo <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------------------------------- Dashboard shell ---------------------------------- */

function StatCard({ icon: Icon, label, value, sub, tone = 'text-brand-600' }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4 sm:p-5">
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50', tone)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{value}</p>
          <p className="truncate text-xs text-slate-500">{label}{sub ? ` · ${sub}` : ''}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingTripCard({ req }) {
  if (!req) return null
  const meta = requestStatusMeta(req.status)
  return (
    <Link to={`/trips/${req.id}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-200">Upcoming trip</p>
          <Badge className="bg-white/15 text-white ring-0">{meta.label}</Badge>
        </div>
        <p className="mt-2 flex items-center gap-2 font-display text-xl font-semibold">
          <MapPin className="size-4.5 text-sun-300" /> {req.from} → {req.destination}
        </p>
        <p className="mt-1 text-sm text-brand-100">{req.title}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-5 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-brand-600" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}</span>
        <span className="flex items-center gap-1.5"><Briefcase className="size-4 text-brand-600" /> {req.purpose}</span>
        <span className="ml-auto flex items-center gap-1.5 font-semibold text-slate-800"><Price amount={req.estimatedCost} /></span>
      </div>
    </Link>
  )
}

function QuickActions() {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="size-4 text-brand-600" /> Quick actions
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link to="/flights" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105">
              <Plane className="size-5" />
            </span>
            <span className="text-xs font-bold text-slate-700">Book Flight</span>
          </Link>
          <Link to="/hotels" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105">
              <Hotel className="size-5" />
            </span>
            <span className="text-xs font-bold text-slate-700">Book Hotel</span>
          </Link>
          <Link to="/trips/new" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105">
              <Briefcase className="size-5" />
            </span>
            <span className="text-xs font-bold text-slate-700">Create Trip</span>
          </Link>
          <Link to="/claims" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105">
              <Receipt className="size-5" />
            </span>
            <span className="text-xs font-bold text-slate-700">File Expense</span>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" asChild><Link to="/my-trips">My Trips</Link></Button>
          <Button variant="secondary" size="sm" asChild><Link to="/my-trips?tab=pending">My Requests</Link></Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MyPolicyCard() {
  const { user, isAuthenticated, sessionChecked } = useAuth()
  const { data: policies } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
    enabled: isAuthenticated && sessionChecked,
  })
  const policy = policies?.find((p) => p.designation === user?.designation) || policies?.find((p) => p.grade === user?.grade)
  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
          <ShieldCheck className="size-4 text-emerald-600" /> My travel policy
        </p>
        <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Designation</span><span className="font-semibold text-slate-800">{user?.designation}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Travel grade</span><span className="font-semibold text-slate-800">Grade {user?.grade}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Flight class</span><span className="font-semibold text-slate-800">{policy?.flightClass || 'Economy'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Hotel</span><span className="font-semibold text-slate-800">Up to ₹{(policy?.hotelLimit || 5000).toLocaleString('en-IN')}/night · {policy?.hotelStars || 3}★</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Daily allowance</span><span className="font-semibold text-slate-800">₹{(policy?.dailyAllowance || 1500).toLocaleString('en-IN')}/day</span></div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Admin can update these limits in Travel Policies.</p>
      </CardContent>
    </Card>
  )
}

function RequestRow({ req }) {
  const meta = requestStatusMeta(req.status)
  return (
    <Link to={`/trips/${req.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {req.status === 'pending' ? <Clock className="size-4" /> : req.status === 'approved' ? <CheckCircle2 className="size-4" /> : <Plane className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{req.title}</p>
        <p className="truncate text-xs text-slate-500">{req.from} → {req.destination} · {formatDate(req.startDate)}</p>
      </div>
      <Badge variant={meta.variant}>{meta.label}</Badge>
    </Link>
  )
}

/* ---------------------------------- Employee dashboard ---------------------------------- */

function EmployeeDashboard({ requests }) {
  const { user } = useAuth()
  const upcoming = requests
    .filter((r) => ['pending', 'approved', 'ticketed'].includes(r.status) && new Date(r.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const pending = requests.filter((r) => r.status === 'pending')
  const recent = requests.filter((r) => ['completed', 'cancelled'].includes(r.status)).slice(0, 3)
  const stats = computeStats(requests)
  const approvedUpcoming = requests.filter((r) => ['approved', 'ticketed'].includes(r.status) && new Date(r.startDate) >= new Date())

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Building2 className="size-4 text-brand-600" /> Acme Technologies · {user?.department}
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                {greeting()}, {user?.firstName} 👋
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                What are you travelling for? Search flights, pick a policy-compliant hotel and submit your request for approval.
              </p>
            </div>
            <Button asChild><Link to="/trips/new"><Briefcase className="size-4" /> Create Business Trip</Link></Button>
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Pending requests" value={pending.length} tone="text-amber-600" />
          <StatCard icon={CheckCircle2} label="Approved upcoming" value={approvedUpcoming.length} tone="text-emerald-600" />
          <StatCard icon={Wallet} label="My estimated spend" value={<Price amount={stats.totalSpend} />} tone="text-brand-600" />
          <StatCard icon={ShieldCheck} label="Policy compliance" value={`${stats.violations ? '⚠' : '100%'}`} sub={stats.violations ? `${stats.violations} exception${stats.violations > 1 ? 's' : ''}` : 'all compliant'} tone="text-slate-600" />
        </div>

        {/* Business trip search */}
        <BusinessTripSearch />

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <UpcomingTripCard req={upcoming[0]} />

            {pending.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Clock className="size-4 text-amber-600" /> Pending approval
                    </p>
                    <Link to="/my-trips?tab=pending" className="text-xs font-semibold text-brand-700 hover:underline">View all</Link>
                  </div>
                  <div className="space-y-2">
                    {pending.slice(0, 3).map((r) => <RequestRow key={r.id} req={r} />)}
                  </div>
                </CardContent>
              </Card>
            )}

            {recent.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Plane className="size-4 text-brand-600" /> Recent trips
                    </p>
                    <Link to="/my-trips" className="text-xs font-semibold text-brand-700 hover:underline">View all</Link>
                  </div>
                  <div className="space-y-2">
                    {recent.map((r) => <RequestRow key={r.id} req={r} />)}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <QuickActions />
            <MyPolicyCard />
          </div>
        </div>
      </div>
    </div>
  )
}

function BusinessTripSearch() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ from: 'BOM', to: 'BLR', date: todayISO(14), returnDate: todayISO(17) })
  const toCity = AIRPORTS.find((a) => a.code === form.to)?.city || form.to

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-200 via-sun-200 to-brand-200 p-px shadow-lift">
      <div className="rounded-[15px] bg-white p-4 sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <Briefcase className="size-4 text-brand-600" /> What are you travelling for?
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Select value={form.from} onValueChange={(v) => setForm({ ...form, from: v })}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="From" /></SelectTrigger>
            <SelectContent>
              {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="To" /></SelectTrigger>
            <SelectContent>
              {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
            </SelectContent>
          </Select>
          <input type="date" value={form.date} min={todayISO()} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800" />
          <input type="date" value={form.returnDate} min={form.date || todayISO()} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800" />
          <Button className="h-11" onClick={() => navigate(`/flights?trip=roundtrip&from=${form.from}&to=${form.to}&date=${form.date}&return=${form.returnDate}&cabin=Economy&corp=1`)}>
            <Plane className="size-4" /> Flights
          </Button>
          <Button variant="secondary" className="h-11" onClick={() => navigate(`/hotels?destination=${toCity}&checkIn=${form.date}&checkOut=${form.returnDate}&corp=1`)}>
            <Hotel className="size-4" /> Hotel
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Approver overview ---------------------------------- */

function ApproverOverview({ requests }) {
  const pending = requests.filter((r) => r.status === 'pending')
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <h1 className="font-display text-3xl font-semibold text-slate-900">Approver overview</h1>
          <p className="mt-2 text-sm text-slate-500">Review travel requests from your team, check policy compliance and approve or reject with context.</p>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Awaiting review" value={pending.length} tone="text-amber-600" />
          <StatCard icon={CheckCircle2} label="Approved (all time)" value={requests.filter((r) => r.status === 'approved').length} tone="text-emerald-600" />
          <StatCard icon={XCircle} label="Rejected" value={requests.filter((r) => r.status === 'rejected').length} tone="text-rose-600" />
          <StatCard icon={Wallet} label="Pipeline value" value={<Price amount={requests.filter((r) => r.status === 'pending').reduce((s, r) => s + (r.estimatedCost || 0), 0)} />} tone="text-brand-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><ClipboardList className="size-4 text-brand-600" /> Requests awaiting your approval</p>
                <Link to="/approvals" className="text-xs font-semibold text-brand-700 hover:underline">Open approvals</Link>
              </div>
              <div className="space-y-2">
                {pending.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">All caught up — no pending requests.</p>
                ) : (
                  pending.map((r) => <RequestRow key={r.id} req={r} />)
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Users className="size-4 text-brand-600" /> Team travel activity</p>
              <div className="space-y-2.5 text-sm">
                {requests.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{r.employee.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{r.destination} · {formatDate(r.startDate)}</p>
                    </div>
                    <Badge variant={requestStatusMeta(r.status).variant}>{requestStatusMeta(r.status).label}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Finance overview ---------------------------------- */

function FinanceOverview({ requests, claims }) {
  const list = claims || []
  const pending = list.filter((c) => c.status === 'pending')
  const pendingValue = pending.reduce((s, c) => s + c.amount, 0)
  const reimbursed = list.filter((c) => c.status === 'reimbursed')
  const approved = list.filter((c) => c.status === 'approved')
  const totalClaimed = list.filter((c) => c.status !== 'rejected').reduce((s, c) => s + c.amount, 0)
  const recentDecisions = [...list].filter((c) => c.status !== 'pending').slice(0, 5)

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-slate-900">Finance overview</h1>
              <p className="mt-2 text-sm text-slate-500">Employee expense claims across the company — review, approve and reimburse in one place.</p>
            </div>
            <Button asChild><Link to="/claims"><Receipt className="size-4" /> Open claims queue</Link></Button>
          </div>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Pending claims" value={pending.length} tone="text-amber-600" />
          <StatCard icon={Banknote} label="Pending value" value={<Price amount={pendingValue} />} tone="text-brand-600" />
          <StatCard icon={CheckCircle2} label="Approved" value={approved.length + reimbursed.length} tone="text-emerald-600" />
          <StatCard icon={Wallet} label="Total claimed" value={<Price amount={totalClaimed} />} tone="text-slate-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Receipt className="size-4 text-brand-600" /> Claims awaiting review</p>
                <Link to="/claims" className="text-xs font-semibold text-brand-700 hover:underline">Open queue</Link>
              </div>
              {pending.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">All caught up — no pending claims.</p>
              ) : (
                <div className="space-y-2">
                  {pending.map((c) => (
                    <Link key={c.id} to="/claims" className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Receipt className="size-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{c.employee?.name} · <Price amount={c.amount} /></p>
                        <p className="truncate text-xs text-slate-500">{c.category} · {c.tripTitle || c.destination || c.tripRef}</p>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Banknote className="size-4 text-brand-600" /> Recent decisions</p>
              {recentDecisions.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No decisions yet.</p>
              ) : (
                <div className="space-y-2.5 text-sm">
                  {recentDecisions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">{c.employee?.name} · <Price amount={c.amount} /></p>
                        <p className="truncate text-[11px] text-slate-500">{c.category} · {c.tripRef || c.tripTitle}</p>
                      </div>
                      <Badge variant={claimStatusMeta(c.status).variant}>{claimStatusMeta(c.status).label}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Admin overview ---------------------------------- */

function AdminOverview({ requests }) {
  const stats = computeStats(requests)
  const maxCity = stats.topCities[0]
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <h1 className="font-display text-3xl font-semibold text-slate-900">Travel administration</h1>
          <p className="mt-2 text-sm text-slate-500">Company-wide travel spend, approvals and policy control.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild><Link to="/admin"><ClipboardList className="size-4" /> Open admin console</Link></Button>
            <Button variant="secondary" asChild><Link to="/admin/policies"><ShieldCheck className="size-4" /> Travel policies</Link></Button>
          </div>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Estimated travel spend" value={<Price amount={stats.totalSpend} />} tone="text-brand-600" />
          <StatCard icon={Plane} label="Total trips" value={stats.totalTrips} tone="text-slate-600" />
          <StatCard icon={Clock} label="Pending approvals" value={stats.pending} tone="text-amber-600" />
          <StatCard icon={ShieldCheck} label="Policy exceptions" value={stats.violations} tone="text-rose-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin className="size-4 text-brand-600" /> Most travelled city</p>
              {maxCity ? (
                <>
                  <p className="font-display text-3xl font-bold text-slate-900">{maxCity.city}</p>
                  <p className="mt-1 text-xs text-slate-500">{maxCity.count} trip{maxCity.count > 1 ? 's' : ''} booked</p>
                </>
              ) : <p className="text-sm text-slate-500">No trips yet</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-brand-600" /> Trips by status</p>
              <div className="space-y-2.5">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-semibold capitalize text-slate-600">{status}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn('h-full rounded-full', status === 'pending' ? 'bg-amber-400' : status === 'rejected' || status === 'cancelled' ? 'bg-rose-400' : status === 'completed' ? 'bg-slate-400' : 'bg-brand-500')} style={{ width: `${stats.totalTrips ? Math.round((count / stats.totalTrips) * 100) : 0}%` }} />
                    </div>
                    <span className="w-6 text-right text-xs font-bold text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Wallet className="size-4 text-brand-600" /> Spend by month</p>
              <div className="flex h-32 items-end gap-2">
                {stats.byMonth.map((m) => (
                  <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600">₹{(m.value / 1000).toFixed(0)}k</span>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${Math.max(6, Math.round((m.value / Math.max(...stats.byMonth.map((x) => x.value), 1)) * 100))}%`, maxHeight: '100px' }} />
                    <span className="text-[10px] text-slate-400">{m.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------- Entry ---------------------------------- */

export default function Home() {
  const { user, isAuthenticated, role, sessionChecked } = useAuth()

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'dashboard', user?.id],
    queryFn: () => corporateApi.getRequests({ role, scope: user?.id }),
    enabled: isAuthenticated && sessionChecked,
  })
  const { data: claims } = useQuery({
    queryKey: ['claims', 'dashboard', user?.id],
    queryFn: () => corporateApi.getClaims(),
    enabled: isAuthenticated && sessionChecked,
  })

  if (!isAuthenticated) return <GuestLanding />

  if (isLoading) {
    return (
      <div className="container-x py-10 space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  const list = requests || []
  if (role === 'admin') return <AdminOverview requests={list} />
  if (role === 'approver') return <ApproverOverview requests={list} />
  if (role === 'finance') return <FinanceOverview requests={list} claims={claims} />
  return <EmployeeDashboard requests={list} />
}
