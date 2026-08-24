import { useState, useRef } from 'react'
import {
  Plane, Download, Printer, Share2, ArrowRight, User, Luggage, Armchair,
  Calendar, Clock, CreditCard, Ticket, MapPin, Info, AlertTriangle,
  CheckCircle2, Utensils, Shield, ChevronRight, FileText, Home, Loader2,
  Copy, ExternalLink,
} from 'lucide-react'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { Separator } from './ui/separator.jsx'
import { formatDate, formatTime, formatDay, fullName, minutesToLabel } from '../utils/format.js'
import { downloadTicket } from '../utils/generateTicket.js'
import { useToast } from '../context/ToastContext.jsx'

/* ── Simple SVG barcode generator (no external deps) ── */
function BarcodeSVG({ value, width = 160, height = 48 }) {
  if (!value) return null
  const chars = value.split('')
  const bars = []
  let x = 0
  const barWidth = width / (chars.length * 2 + 1)
  chars.forEach((ch) => {
    const code = ch.charCodeAt(0)
    bars.push({ x, w: barWidth * (0.5 + (code % 3) * 0.3), dark: true })
    x += barWidth
    bars.push({ x, w: barWidth * (0.3 + (code % 2) * 0.2), dark: false })
    x += barWidth
  })
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
      {bars.map((b, i) =>
        b.dark ? (
          <rect key={i} x={b.x} y={0} width={b.w} height={height} fill="#0f172a" rx="0.5" />
        ) : null,
      )}
      <text x={width / 2} y={height - 2} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#64748b">
        {value}
      </text>
    </svg>
  )
}

/* ── Flight route visualizer ── */
function FlightRoute({ from, to, airline, duration, stops, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{from?.code}</p>
        <p className="text-xs text-slate-500">{from?.city}</p>
      </div>
      <div className="flex flex-1 flex-col items-center gap-1">
        <div className="relative h-px w-full bg-slate-300">
          <div className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white" />
          <div className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white" />
          <Plane className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-90 text-brand-600" />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>{duration || 'Direct'}</span>
          {stops !== undefined && stops !== null && (
            <>
              <span>·</span>
              <span>{stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{to?.code}</p>
        <p className="text-xs text-slate-500">{to?.city}</p>
      </div>
    </div>
  )
}

/* ── Info row helper ── */
function InfoRow({ icon: Icon, label, value, mono = false, accent = false }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-brand-500" />}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`mt-0.5 text-sm text-slate-800 ${mono ? 'font-mono' : ''} ${accent ? 'font-bold text-brand-700' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

/* ── Main ETicket Component ── */
export default function ETicket({ booking }) {
  const { toast, error: showError } = useToast()
  const ticketRef = useRef(null)
  const [sharing, setSharing] = useState(false)

  const b = booking
  if (!b) return null

  const isFlight = b.type === 'flight'
  const summary = b.summary || {}
  const payment = b.payment || {}
  const passengers = b.passengers || []
  const addons = b.addons || []

  // Calculate flight duration label
  const getDurationLabel = () => {
    if (summary.dep && summary.arr) {
      const dep = new Date(summary.dep)
      const arr = new Date(summary.arr)
      const diffMin = Math.round((arr - dep) / 60000)
      return minutesToLabel(diffMin)
    }
    return null
  }

  // Generate a ticket number from booking ref
  const ticketNumber = `TKT-${(b.ref || '000000').replace('SR-', '').toUpperCase()}-${b.pnr?.slice(0, 4) || '0000'}`

  // Convenience fee (mock)
  const convenienceFee = 99

  /* ── Handlers ── */
  const handleDownload = () => {
    // Generate PDF synchronously within the click handler (user gesture)
    // BEFORE any setState, so the browser allows the blob download.
    try {
      const result = downloadTicket(b, 'ticket')
      if (result.success) {
        toast('E-ticket downloaded successfully.', 'Download')
      } else {
        showError('Unable to download your e-ticket. Please try again.', 'Download failed')
      }
    } catch (err) {
      console.error('Download error:', err)
      showError('Unable to download your e-ticket. Please try again.', 'Download failed')
    }
  }

  const handlePrint = () => {
    const printContent = ticketRef.current
    if (!printContent) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      showError('Pop-up blocked. Please allow pop-ups to print.', 'Print blocked')
      return
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>E-Ticket - ${b.pnr || b.ref}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: white; padding: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleShare = async () => {
    const shareData = {
      title: `E-Ticket - ${b.title || 'Flight Booking'}`,
      text: `My booking confirmed! PNR: ${b.pnr} | ${b.title || ''} | Date: ${formatDate(b.travelDate)}`,
      url: window.location.href,
    }
    if (navigator.share) {
      setSharing(true)
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback: copy to clipboard
          await navigator.clipboard?.writeText(`${shareData.text}\n${shareData.url}`)
          toast('Booking details copied to clipboard!', 'Shared')
        }
      } finally {
        setSharing(false)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard?.writeText(`${shareData.text}\n${shareData.url}`)
        toast('Booking details copied to clipboard!', 'Copied')
      } catch {
        showError('Unable to share. Please copy the booking reference manually.', 'Share failed')
      }
    }
  }

  const handleCopyPNR = async () => {
    try {
      await navigator.clipboard?.writeText(b.pnr || '')
      toast('PNR copied to clipboard!', 'Copied')
    } catch {
      showError('Unable to copy PNR.', 'Copy failed')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Action buttons */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 no-print">
        <Button variant="secondary" onClick={handleDownload}>
          <Download className="size-4" /> Download PDF
        </Button>
        <Button variant="secondary" onClick={handlePrint}>
          <Printer className="size-4" /> Print
        </Button>
        <Button variant="secondary" onClick={handleShare} disabled={sharing}>
          {sharing ? <Loader2 className="size-4 animate-spin" /> : <Share2 className="size-4" />}
          Share
        </Button>
        <Button asChild>
          <a href="/my-trips"><FileText className="size-4" /> My Bookings</a>
        </Button>
      </div>

      {/* ── E-Ticket Card ── */}
      <div ref={ticketRef} className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lift">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1628] via-[#0f2341] to-[#132d54] px-6 py-5 sm:px-8 sm:py-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 size-40 rounded-full border border-white/20" />
            <div className="absolute -right-5 -top-5 size-24 rounded-full border border-white/20" />
            <div className="absolute bottom-0 left-10 size-20 rounded-full border border-white/20" />
          </div>
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white/10">
                  <Plane className="size-4 text-white" />
                </span>
                <h2 className="font-display text-lg font-bold text-white sm:text-xl">E-Ticket</h2>
              </div>
              <p className="mt-1 text-xs text-slate-300">Booking Confirmed</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">CONFIRMED</span>
              </div>
              <p className="mt-1 font-mono text-xs text-slate-300">Issued {formatDate(b.bookingDate)}</p>
            </div>
          </div>
        </div>

        {/* PNR & References */}
        <div className="border-b border-dashed border-slate-200 bg-slate-50/80 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">PNR</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <p className="font-mono text-lg font-bold text-slate-900">{b.pnr || '—'}</p>
                  <button
                    type="button"
                    onClick={handleCopyPNR}
                    className="no-print rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                    title="Copy PNR"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Booking Ref</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-slate-900">{b.ref || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ticket No.</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-slate-700">{ticketNumber}</p>
              </div>
            </div>
            {/* Barcode */}
            <div className="hidden sm:block">
              <BarcodeSVG value={b.pnr || b.ref || 'TKT000'} width={120} height={40} />
            </div>
          </div>
        </div>

        {/* ── Flight Route Section (for flights) ── */}
        {isFlight && (
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <FlightRoute
              from={summary.from}
              to={summary.to}
              airline={summary.airline}
              duration={getDurationLabel()}
              stops={summary.stops}
            />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoRow icon={Calendar} label="Date" value={`${formatDay(summary.dep)}, ${formatDate(summary.dep)}`} />
              <InfoRow icon={Clock} label="Departure" value={formatTime(summary.dep)} accent />
              <InfoRow icon={Clock} label="Arrival" value={formatTime(summary.arr)} accent />
              <InfoRow icon={Plane} label="Flight" value={summary.airline} mono />
            </div>
          </div>
        )}

        {/* ── Hotel / Package details for non-flights ── */}
        {!isFlight && (
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50">
                <MapPin className="size-5 text-brand-600" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-slate-900">{b.title}</p>
                <p className="text-sm text-slate-500">{b.destination}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoRow icon={Calendar} label="Travel Date" value={formatDate(b.travelDate)} />
              {summary.checkIn && <InfoRow icon={Clock} label="Check-in" value={`${formatDate(summary.checkIn)} · ${formatTime(summary.checkIn)}`} />}
              {summary.checkOut && <InfoRow icon={Clock} label="Check-out" value={`${formatDate(summary.checkOut)} · ${formatTime(summary.checkOut)}`} />}
              {summary.nights && <InfoRow icon={Armchair} label="Duration" value={`${summary.nights} night${summary.nights > 1 ? 's' : ''}`} />}
            </div>
          </div>
        )}

        {/* ── Perforated Divider ── */}
        <div className="relative px-6 sm:px-8">
          <div className="absolute left-0 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
          <div className="absolute right-0 top-1/2 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50" />
          <div className="border-t border-dashed border-slate-300" />
        </div>

        {/* ── Passenger Details ── */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <User className="size-4 text-brand-500" /> Passenger{passengers.length !== 1 ? 's' : ''}
          </h3>
          <div className="mt-3 divide-y divide-slate-100">
            {passengers.length > 0 ? passengers.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                    {fullName(p)[0] || 'P'}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{fullName(p)}</p>
                    <p className="text-xs text-slate-500">
                      {p.type || 'Adult'}{p.gender ? ` · ${p.gender}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.seat && (
                    <Badge variant="secondary" className="font-mono">
                      <Armchair className="size-3" /> {p.seat}
                    </Badge>
                  )}
                  <Badge variant="default">{p.type || 'Adult'}</Badge>
                </div>
              </div>
            )) : (
              <p className="py-2 text-sm text-slate-400">No passenger details available</p>
            )}
          </div>
        </div>

        {/* ── Flight Info Grid ── */}
        {isFlight && (
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Ticket className="size-4 text-brand-500" /> Flight Information
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              <InfoRow icon={Plane} label="Airline" value={summary.airline} mono />
              <InfoRow icon={Armchair} label="Cabin Class" value={summary.cabin || 'Economy'} />
              <InfoRow icon={Luggage} label="Baggage" value={summary.baggage || '15 kg + 7 kg cabin'} />
              {summary.terminal && <InfoRow icon={MapPin} label="Terminal" value={summary.terminal} />}
              {summary.stops !== undefined && (
                <InfoRow
                  icon={summary.stops === 0 ? CheckCircle2 : AlertTriangle}
                  label="Stops"
                  value={summary.stops === 0 ? 'Non-stop' : `${summary.stops} stop${summary.stops > 1 ? 's' : ''}`}
                />
              )}
              {summary.aircraft && <InfoRow icon={Plane} label="Aircraft" value={summary.aircraft} />}
            </div>
          </div>
        )}

        {/* ── Additional Info (Meal, Boarding) ── */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Info className="size-4 text-brand-500" /> Additional Information
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            <InfoRow icon={Utensils} label="Meal" value={summary.meal || 'Standard (Buy on board)'} />
            <InfoRow icon={CheckCircle2} label="Boarding Status" value={b.status === 'confirmed' ? 'Check-in pending' : b.status === 'cancelled' ? 'Cancelled' : b.status} />
            <InfoRow icon={Calendar} label="Booking Date" value={formatDate(b.bookingDate)} />
          </div>
        </div>

        {/* ── Fare Breakdown ── */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CreditCard className="size-4 text-brand-500" /> Fare Breakdown
          </h3>
          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Base fare ({passengers.length || 1} × ₹{((payment.base || 0) / Math.max(1, passengers.length)).toLocaleString('en-IN')})</span>
              <span className="font-medium text-slate-800">₹{(payment.base || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Taxes & fees</span>
              <span className="font-medium text-slate-800">₹{(payment.taxes || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Convenience fee</span>
              <span className="font-medium text-slate-800">₹{convenienceFee.toLocaleString('en-IN')}</span>
            </div>
            {addons.map((a, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-500">{a.name}</span>
                <span className="font-medium text-slate-800">₹{(a.price || 0).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-slate-800">Total amount</span>
              <span className="text-xl font-bold text-slate-900">
                ₹{((payment.paid || 0) + convenienceFee).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment status</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 className="size-3.5" /> Paid
              </span>
            </div>
            <p className="mt-1 text-slate-500">Paid via {payment.method || 'N/A'}</p>
          </div>
        </div>

        {/* ── QR Code / Barcode ── */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold text-slate-800">Scan for Booking Details</h3>
              <p className="mt-1 text-xs text-slate-500">
                Scan this code at the airport kiosk or use it for quick check-in
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BarcodeSVG value={b.pnr || b.ref || 'TKT000'} width={160} height={56} />
            </div>
          </div>
        </div>

        {/* ── Travel Instructions ── */}
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Info className="size-4 text-amber-500" /> Important Travel Instructions
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Please arrive at the airport at least <strong>2 hours before domestic</strong> and <strong>3 hours before international</strong> flights.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Carry a valid <strong>government-issued photo ID</strong> (Aadhaar, Passport, or Driving License) for identity verification.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Web check-in opens <strong>48 hours</strong> before departure. Check in online to save time at the airport.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Ensure your <strong>carry-on baggage</strong> does not exceed {summary.baggage?.split('+')?.[1]?.trim() || '7 kg'} and fits in the overhead bin or under the seat.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Prohibited items include sharp objects, flammable materials, and liquids over 100ml in carry-on.
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-brand-500" />
              Keep this e-ticket and your ID ready for verification at the airport security checkpoint.
            </li>
          </ul>
        </div>

        {/* ── Cancellation / Refund ── */}
        <div className="px-6 py-5 sm:px-8">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <AlertTriangle className="size-4 text-amber-500" /> Cancellation & Refund Policy
          </h3>
          {b.status === 'cancelled' ? (
            <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-700">
              <p className="font-semibold">This booking has been cancelled.</p>
              <p className="mt-1">
                Refund of ₹{(payment.refunded || 0).toLocaleString('en-IN')} has been processed to your original payment method ({payment.method || 'N/A'}).
                Refund typically takes 5-7 business days to reflect in your account.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>Free cancellation:</strong> Cancel up to 24 hours before departure for a full refund (excluding convenience fees).
              </p>
              <p>
                <strong>Cancellation charges:</strong> ₹2,500 per passenger applies for cancellations within 24 hours of departure.
              </p>
              <p>
                <strong>Date change:</strong> Permitted up to 3 hours before departure with a change fee of ₹1,500 per passenger, subject to fare difference.
              </p>
              <p>
                <strong>No-show:</strong> If you do not check in or board the flight, no refund will be provided.
              </p>
              <p>
                <strong>Government taxes:</strong> Refundable as per airline policy. Processing time: 7-10 business days.
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>This is a computer-generated e-ticket. No signature is required.</p>
            <p>Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-3">
            <p className="text-xs font-semibold text-slate-500">AkbarBizvoy — Corporate Travel Solutions</p>
            <div className="no-print flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={handleDownload}>
                <Download className="size-3" /> PDF
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={handlePrint}>
                <Printer className="size-3" /> Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action buttons (no-print) */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 pb-8 no-print">
        <Button asChild>
          <a href="/my-trips"><FileText className="size-4" /> View My Bookings</a>
        </Button>
        <Button variant="secondary" asChild>
          <a href="/"><Home className="size-4" /> Return Home</a>
        </Button>
      </div>
    </div>
  )
}
