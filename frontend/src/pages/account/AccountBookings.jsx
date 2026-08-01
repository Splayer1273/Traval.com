import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Luggage, Plane, Hotel, Briefcase, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Img from '../../components/Img.jsx'
import { Price } from '../../components/Price.jsx'
import { bookingApi } from '../../services/bookingApi.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatDate } from '../../utils/format.js'

const TYPE_ICON = { flight: Plane, hotel: Hotel, package: Briefcase }
const STATUS = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

export default function AccountBookings({ filter }) {
  const { isAuthenticated } = useAuth()
  // Normalize the filter prop: 'upcoming'/'completed' pass through, anything
  // else (including undefined from /account/bookings) defaults to 'all'.
  const [tab, setTab] = useState(['upcoming', 'completed'].includes(filter) ? filter : 'all')
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getBookings({}),
    enabled: isAuthenticated,
  })

  const filtered = (bookings || []).filter((b) => tab === 'all' || b.status === tab)

  return (
    <Card>
      <CardHeader>
        <CardTitle>My bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value={tab}>
            {isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState icon={Luggage} title="No bookings here" text="Book a trip and it will show up in this list." action={<Button asChild><Link to="/flights">Search flights</Link></Button>} />
            ) : (
              <div className="space-y-3">
                {filtered.map((b) => {
                  const Icon = TYPE_ICON[b.type] || Plane
                  const st = STATUS[b.status] || STATUS.confirmed
                  return (
                    <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 p-3.5 transition-colors hover:border-brand-300 hover:bg-brand-50/30">
                      <Img src={b.image} alt={b.title} className="h-16 w-20 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="size-3.5 text-brand-600" />
                          <p className="truncate text-sm font-bold text-slate-800">{b.title}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{b.destination} · {formatDate(b.travelDate)}</p>
                      </div>
                      <div className="text-right">
                        <Price amount={b.amount} className="text-sm font-bold text-slate-900" />
                        <div className="mt-1"><Badge variant={st.variant}>{st.label}</Badge></div>
                      </div>
                      <Button size="sm" variant="secondary" asChild><Link to={`/my-trips/${b.id}`}><Eye className="size-3.5" /> View</Link></Button>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
