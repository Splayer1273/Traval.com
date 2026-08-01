import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Luggage, Plane, Hotel, Briefcase, Download, Eye, XCircle, Headphones,
  Pencil, ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Price } from '../components/Price.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { bookingApi } from '../services/bookingApi.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate } from '../utils/format.js'

const TYPE_ICON = { flight: Plane, hotel: Hotel, package: Briefcase }

const STATUS_BADGE = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

function BookingCard({ b, onCancel, onDownload, onModify, onSupport }) {
  const Icon = TYPE_ICON[b.type] || Plane
  const badge = STATUS_BADGE[b.status]
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:shadow-lift">
      <div className="grid sm:grid-cols-[220px_1fr]">
        <div className="relative h-40 sm:h-full">
          <Img src={b.image} alt={b.title} className="absolute inset-0" imgClassName="transition-transform duration-500 hover:scale-105" />
          <div className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-xl bg-white/90 backdrop-blur">
            <Icon className="size-4.5 text-brand-600" />
          </div>
        </div>
        <div className="flex flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-400">{b.pnr}</span>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">{b.title}</h3>
              <p className="text-xs text-slate-500">{b.destination}</p>
            </div>
            <div className="text-right">
              <Price amount={b.amount} className="text-xl font-bold text-slate-900" />
              <p className="text-[11px] text-slate-400">paid {formatDate(b.bookingDate)}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
            <span>Booked {formatDate(b.bookingDate)}</span>
            <span>Travel {formatDate(b.travelDate)}</span>
            <span>{b.passengers?.length || 1} traveller{b.passengers?.length > 1 ? 's' : ''}</span>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            <Button size="sm" variant="secondary" asChild><Link to={`/my-trips/${b.id}`}><Eye className="size-4" /> View Details</Link></Button>
            <Button size="sm" variant="ghost" onClick={() => onDownload(b)}><Download className="size-4" /> Ticket</Button>
            <Button size="sm" variant="ghost" onClick={() => onDownload(b, true)}><Download className="size-4" /> Invoice</Button>
            {b.status !== 'cancelled' && b.status !== 'completed' && (
              <>
                <Button size="sm" variant="ghost" className="text-amber-700 hover:bg-amber-50" onClick={() => onModify(b)}><Pencil className="size-4" /> Modify</Button>
                <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => onCancel(b)}><XCircle className="size-4" /> Cancel</Button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={() => onSupport(b)}><Headphones className="size-4" /> Support</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MyTrips() {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const qc = useQueryClient()
  const [status, setStatus] = useState('all')

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getBookings({}),
    enabled: isAuthenticated,
  })

  const cancelMutation = useMutation({
    mutationFn: bookingApi.cancelBooking,
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      toast(`Booking ${b.pnr} has been cancelled. Refund will be processed in 5–7 days.`, 'Booking cancelled')
    },
  })

  const filtered = (bookings || []).filter((b) => status === 'all' || b.status === status)

  const handleDownload = (b, invoice = false) => {
    toast(invoice ? `Invoice for ${b.pnr} downloaded.` : `E-ticket for ${b.pnr} downloaded.`, 'Download')
  }
  const handleModify = (b) => toast(`Modification flow opened for ${b.pnr}. Changes are subject to fare difference.`, 'Modify booking')
  const handleSupport = (b) => toast(`Connecting you to support for ${b.pnr}… A specialist will reply shortly.`, '24×7 support')

  if (!isAuthenticated) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={Luggage}
          title="Sign in to view your trips"
          text="Your bookings, tickets and invoices will appear here once you log in."
          action={<Button asChild><Link to="/login">Sign in</Link></Button>}
        />
      </div>
    )
  }

  return (
    <div>
      <PageHero image="airport" title="My Trips" subtitle="Manage your bookings, download tickets and track everything in one place" crumb={[{ label: 'My Trips' }]} />

      <div className="container-x mt-8">
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="all">All ({bookings?.length || 0})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={status} className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white sm:grid-cols-[220px_1fr]">
                    <Skeleton className="h-40 sm:h-full" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-64" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title={status === 'all' ? 'No trips yet' : `No ${status} trips`}
                text="When you book flights, hotels or packages, they'll show up here."
                action={<Button asChild><Link to="/flights"><Plane className="size-4" /> Search flights</Link></Button>}
              />
            ) : (
              <div className="space-y-4">
                {filtered.map((b) => (
                  <BookingCard
                    key={b.id}
                    b={b}
                    onCancel={(bb) => cancelMutation.mutate(bb.id)}
                    onDownload={handleDownload}
                    onModify={handleModify}
                    onSupport={handleSupport}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
