import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Button } from '../components/ui/button.jsx'
import { bookingApi } from '../services/bookingApi.js'
import ETicket from '../components/ETicket.jsx'

export default function ETicketPage() {
  const { id } = useParams()
  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getBooking(id),
  })

  if (isLoading) {
    return (
      <div className="bg-slate-50">
        <div className="container-x py-10">
          <div className="mx-auto max-w-3xl space-y-6">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="bg-slate-50">
        <div className="container-x py-16 text-center">
          <p className="font-display text-xl font-semibold text-slate-800">Booking not found</p>
          <p className="mt-2 text-sm text-slate-500">The booking you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" asChild><a href="/my-trips">Back to My Bookings</a></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50">
      <div className="container-x py-8 sm:py-10">
        <ETicket booking={booking} />
      </div>
    </div>
  )
}
