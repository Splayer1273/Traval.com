import { Link } from 'react-router-dom'
import {
  ArrowRight, Bell, BellRing, CheckCheck, ClipboardList, Plane, Receipt, ShieldCheck, Ticket, XCircle,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { cn } from '../lib/utils.js'

const TYPE_ICON = {
  approval: { icon: CheckCheck, tone: 'bg-emerald-50 text-emerald-600' },
  pending: { icon: ClipboardList, tone: 'bg-amber-50 text-amber-600' },
  rejected: { icon: XCircle, tone: 'bg-rose-50 text-rose-600' },
  ticket: { icon: Ticket, tone: 'bg-brand-50 text-brand-600' },
  policy: { icon: ShieldCheck, tone: 'bg-sky-50 text-sky-600' },
  cancelled: { icon: XCircle, tone: 'bg-rose-50 text-rose-600' },
  report: { icon: BellRing, tone: 'bg-slate-50 text-slate-600' },
  claim: { icon: Receipt, tone: 'bg-teal-50 text-teal-600' },
}

export default function NotificationsPage() {
  const { notifs, loading, unread, markRead, markAllRead } = useNotifications()

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Bell className="size-4 text-brand-600" /> Notification center
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Notifications</h1>
              <p className="mt-2 text-sm text-slate-500">
                Approval decisions, policy checks and ticket updates for your travel.
                {unread > 0 && <span className="ml-2 font-semibold text-brand-700">{unread} unread</span>}
              </p>
            </div>
            {unread > 0 && (
              <Button variant="secondary" onClick={markAllRead}><CheckCheck className="size-4" /> Mark all as read</Button>
            )}
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
          </div>
        ) : notifs.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" text="Approval updates and travel alerts will appear here." />
        ) : (
          <div className="mx-auto max-w-3xl space-y-3">
            {notifs.map((n) => {
              const meta = TYPE_ICON[n.type] || TYPE_ICON.pending
              const body = (
                <Card
                  className={cn('cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lift', !n.read && 'border-brand-200 bg-brand-50/30')}
                  onClick={() => markRead(n.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                    <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', meta.tone)}>
                      <meta.icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-500">{n.text}</p>
                      {n.link && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                          View <ArrowRight className="size-3" />
                        </span>
                      )}
                    </div>
                    {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />}
                  </CardContent>
                </Card>
              )
              return n.link ? <Link key={n.id} to={n.link} className="block">{body}</Link> : <div key={n.id}>{body}</div>
            })}
          </div>
        )}
      </div>
    </div>
  )
}
