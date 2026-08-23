import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Mail, Search, ShieldCheck, Users } from 'lucide-react'
import { Badge } from '../../components/ui/badge.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import AdminNav from '../../components/layout/AdminNav.jsx'
import { CORPORATE_USERS } from '../../data/corporate.js'
import { api } from '../../lib/api.js'
import { cn } from '../../lib/utils.js'

const ROLE_BADGE = {
  employee: { label: 'Employee', variant: 'default' },
  approver: { label: 'Approver', variant: 'sun' },
  finance: { label: 'Finance', variant: 'secondary' },
  admin: { label: 'Admin', variant: 'danger' },
}

const mapUser = (u) => {
  const names = (u.name || '').split(' ')
  return {
    id: u._id || u.id,
    firstName: names[0] || (u.email || '').split('@')[0],
    lastName: names.slice(1).join(' '),
    email: u.email,
    employeeId: u.employeeId || '',
    designation: u.designation || '',
    grade: u.grade || '',
    department: u.department || '',
    manager: u.manager || '',
    costCenter: u.costCenter || '',
    location: u.location || '',
    role: u.role === 'manager' ? 'approver' : u.role === 'admin' ? 'admin' : u.role === 'finance' ? 'finance' : 'employee',
  }
}

/** Load employees from the API (admin), falling back to the static directory. */
async function loadEmployees() {
  try {
    const res = await api.get('/users')
    const list = res.data?.data
    if (Array.isArray(list) && list.length) return list.map(mapUser)
  } catch {
    // API unavailable — fall through to the static directory.
  }
  return CORPORATE_USERS
}

export default function AdminEmployees() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('all')

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: loadEmployees,
    staleTime: 60_000,
  })
  const list = users || []

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return list.filter((u) => {
      if (dept !== 'all' && u.department !== dept) return false
      if (!q) return true
      return `${u.firstName} ${u.lastName} ${u.email} ${u.employeeId} ${u.designation}`.toLowerCase().includes(q)
    })
  }, [query, dept, list])

  const stats = useMemo(() => {
    const total = list.length
    const byDept = {}
    list.forEach((u) => { byDept[u.department || 'Other'] = (byDept[u.department || 'Other'] || 0) + 1 })
    const perDept = Object.entries(byDept).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
    return { total, perDept }
  }, [list])

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-6 sm:py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Users className="size-4 text-brand-600" /> People directory
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Employees</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Company directory with designations, travel grades and managers. Roles drive what each user sees in the portal.
          </p>
          <div className="mt-4 sm:mt-5"><AdminNav /></div>
        </div>
      </div>

      <div className="container-x py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardContent className="p-4 sm:p-5">
                <p className="mb-3 text-sm font-bold text-slate-900">Departments</p>
                <div className="space-y-1">
                  <button type="button" onClick={() => setDept('all')} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors', dept === 'all' ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                    All departments <span className="text-xs">{stats.total}</span>
                  </button>
                  {stats.perDept.map((d) => (
                    <button key={d.name} type="button" onClick={() => setDept(d.name)} className={cn('flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors', dept === d.name ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                      {d.name} <span className="text-xs">{d.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-5 text-xs leading-relaxed text-slate-500">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-800"><ShieldCheck className="size-4 text-brand-600" /> Access control</p>
                Employees see only their own requests. Approvers see the full company queue. Admins manage policies, employees and all bookings.
              </CardContent>
            </Card>
          </aside>

          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-10" placeholder="Search by name, email, ID or designation…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}</div>
            ) : filtered.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No employees match your search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((u) => {
                  const role = ROLE_BADGE[u.role] || ROLE_BADGE.employee
                  return (
                    <Card key={u.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lift">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sun-500 text-base font-bold text-white sm:size-11">
                            {u.firstName[0]}{u.lastName[0]}
                          </span>
                          <Badge variant={role.variant}>{role.label}</Badge>
                        </div>
                        <p className="mt-3 font-display text-sm font-semibold text-slate-900 sm:text-base">{u.firstName} {u.lastName}</p>
                        <p className="text-[11px] text-slate-400 sm:text-xs">{u.employeeId} · {u.email}</p>
                        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs">
                          <p className="flex justify-between"><span className="text-slate-400">Designation</span><span className="font-semibold text-slate-700">{u.designation}</span></p>
                          <p className="flex justify-between"><span className="text-slate-400">Grade</span><span className="font-semibold text-slate-700">Grade {u.grade}</span></p>
                          <p className="flex justify-between"><span className="text-slate-400">Department</span><span className="font-semibold text-slate-700">{u.department}</span></p>
                          <p className="flex justify-between"><span className="text-slate-400">Manager</span><span className="font-semibold text-slate-700">{u.manager}</span></p>
                          <p className="flex justify-between"><span className="text-slate-400">Cost centre</span><span className="font-semibold text-slate-700">{u.costCenter}</span></p>
                        </div>
                        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 sm:text-xs"><Mail className="size-3.5" /> {u.email}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
