import { jsPDF } from 'jspdf'
import { formatDate, formatTime, formatDay, fullName, minutesToLabel } from './format.js'

/**
 * Generate an e-ticket PDF for a booking.
 * @param {Object} booking - The booking object
 * @param {'ticket'|'invoice'} type - What to generate
 * @returns {jsPDF} The generated PDF document
 */
export function generateTicketPDF(booking, type = 'ticket') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 18
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Colors
  const navyColor = [10, 22, 40]       // Dark navy header
  const brandColor = [43, 69, 240]     // brand-600
  const tealColor = [20, 184, 166]     // teal-500
  const darkColor = [15, 23, 42]       // slate-900
  const grayColor = [100, 116, 139]    // slate-500
  const lightGray = [226, 232, 240]    // slate-200
  const greenColor = [16, 185, 129]    // emerald-500
  const amberColor = [245, 158, 11]    // amber-500
  const bgColor = [248, 250, 252]      // slate-50
  const white = [255, 255, 255]

  // ── Header ──
  doc.setFillColor(...navyColor)
  doc.rect(0, 0, pageWidth, 42, 'F')

  // Decorative circles
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.3)
  doc.circle(pageWidth - 25, 15, 20, 'S')
  doc.circle(pageWidth - 20, 10, 12, 'S')

  // Brand name
  doc.setTextColor(...white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('AkbarBizvoy', margin, y + 14)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Corporate Travel Solutions', margin, y + 20)

  // Document type
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const docTitle = type === 'invoice' ? 'INVOICE' : 'E-TICKET'
  doc.text(docTitle, pageWidth - margin, y + 14, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Ref: ${booking.ref || 'N/A'}`, pageWidth - margin, y + 21, { align: 'right' })
  doc.text(`PNR: ${booking.pnr || 'N/A'}`, pageWidth - margin, y + 27, { align: 'right' })

  // Confirmed badge
  doc.setFillColor(...greenColor)
  doc.roundedRect(pageWidth - margin - 32, y + 31, 32, 7, 2, 2, 'F')
  doc.setTextColor(...white)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('CONFIRMED', pageWidth - margin - 16, y + 36, { align: 'center' })

  y = 50

  // ── Booking Reference Section ──
  doc.setFillColor(...bgColor)
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F')

  doc.setTextColor(...darkColor)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('BOOKING REFERENCE', margin + 5, y + 7)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(booking.ref || 'N/A', margin + 5, y + 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('TICKET NUMBER', margin + 50, y + 7)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  const ticketNumber = `TKT-${(booking.ref || '000000').replace('SR-', '').toUpperCase()}-${(booking.pnr || '0000').slice(0, 4)}`
  doc.text(ticketNumber, margin + 50, y + 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('BOOKING DATE', margin + 105, y + 7)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(formatDate(booking.bookingDate), margin + 105, y + 14)

  y += 26

  // ── Flight Details ──
  if (booking.type === 'flight' && booking.summary) {
    // Section title with teal accent
    doc.setFillColor(...tealColor)
    doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('FLIGHT DETAILS', margin + 7, y + 6)
    y += 12

    // Flight info box
    doc.setFillColor(...bgColor)
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F')

    // Departure
    doc.setTextColor(...darkColor)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(formatTime(booking.summary.dep), margin + 6, y + 14)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.summary.from?.code || '', margin + 6, y + 21)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.from?.city || '', margin + 6, y + 26)
    doc.text(formatDate(booking.summary.dep), margin + 6, y + 31)

    // Flight line
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.setLineDashPattern([2, 2], 0)
    doc.line(margin + 48, y + 16, pageWidth - margin - 48, y + 16)
    doc.setLineDashPattern([], 0)

    // Plane icon (simple triangle)
    doc.setFillColor(...brandColor)
    const planeX = pageWidth / 2
    doc.triangle(planeX - 3, y + 14, planeX + 3, y + 16, planeX - 3, y + 18, 'F')

    doc.setFontSize(7)
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.airline || '', planeX, y + 23, { align: 'center' })
    doc.text(booking.summary.cabin || '', planeX, y + 28, { align: 'center' })

    // Arrival
    doc.setTextColor(...darkColor)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(formatTime(booking.summary.arr), pageWidth - margin - 6, y + 14, { align: 'right' })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.summary.to?.code || '', pageWidth - margin - 6, y + 21, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.to?.city || '', pageWidth - margin - 6, y + 26, { align: 'right' })
    doc.text(formatDate(booking.summary.arr), pageWidth - margin - 6, y + 31, { align: 'right' })

    y += 45

    // Flight info grid
    const infoY = y
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)

    const flightInfo = [
      { label: 'AIRLINE', value: booking.summary.airline || '' },
      { label: 'CABIN CLASS', value: booking.summary.cabin || 'Economy' },
      { label: 'BAGGAGE', value: booking.summary.baggage || '15 kg + 7 kg cabin' },
      { label: 'TERMINAL', value: booking.summary.terminal || '' },
      { label: 'STOPS', value: (booking.summary.stops || 0) === 0 ? 'Non-stop' : `${booking.summary.stops} stop(s)` },
    ]

    flightInfo.forEach((info, i) => {
      const col = i % 3
      const row = Math.floor(i / 3)
      const xPos = margin + (col * (contentWidth / 3))

      doc.setFontSize(7)
      doc.setTextColor(...grayColor)
      doc.text(info.label, xPos, infoY + row * 12)
      doc.setFontSize(9)
      doc.setTextColor(...darkColor)
      doc.setFont('helvetica', 'bold')
      doc.text(info.value, xPos, infoY + row * 12 + 5)
      doc.setFont('helvetica', 'normal')
    })

    y = infoY + (Math.ceil(flightInfo.length / 3)) * 12 + 5
  } else if (booking.type === 'hotel' && booking.summary) {
    doc.setFillColor(...tealColor)
    doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('HOTEL DETAILS', margin + 7, y + 6)
    y += 12

    doc.setFillColor(...bgColor)
    doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F')

    doc.setTextColor(...darkColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.summary.hotel || booking.title || 'Hotel', margin + 5, y + 10)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text(`${booking.summary.room || ''} · ${booking.summary.nights || ''} nights · ${booking.summary.board || ''}`, margin + 5, y + 17)
    doc.text(`Check-in: ${formatDate(booking.summary.checkIn)} · Check-out: ${formatDate(booking.summary.checkOut)}`, margin + 5, y + 22)

    y += 32
  }

  // ── Passengers ──
  doc.setFillColor(...tealColor)
  doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')
  doc.setTextColor(...darkColor)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(type === 'invoice' ? 'PASSENGER DETAILS' : 'PASSENGER(S)', margin + 7, y + 6)
  y += 12

  if (booking.passengers && booking.passengers.length > 0) {
    booking.passengers.forEach((p, i) => {
      doc.setFillColor(...bgColor)
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F')

      // Avatar circle
      doc.setFillColor(...brandColor)
      doc.circle(margin + 6, y + 6, 4, 'F')
      doc.setTextColor(...white)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text((fullName(p)[0] || 'P').toUpperCase(), margin + 6, y + 8, { align: 'center' })

      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(fullName(p), margin + 14, y + 7)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...grayColor)
      const details = [
        p.gender || p.type || 'Adult',
        p.seat ? `Seat ${p.seat}` : '',
        p.room ? p.room : '',
      ].filter(Boolean).join(' · ')
      doc.text(details, margin + 14, y + 11)

      // Seat badge
      if (p.seat) {
        doc.setFillColor(...brandColor)
        doc.roundedRect(pageWidth - margin - 22, y + 2, 20, 8, 2, 2, 'F')
        doc.setTextColor(...white)
        doc.setFontSize(7)
        doc.setFont('helvetica', 'bold')
        doc.text(`SEAT ${p.seat}`, pageWidth - margin - 12, y + 7, { align: 'center' })
      }

      y += 14
    })
  } else {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('No passenger details available', margin + 5, y + 5)
    y += 10
  }

  y += 5

  // ── Payment Details ──
  if (booking.payment) {
    doc.setFillColor(...tealColor)
    doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')
    doc.setTextColor(...darkColor)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT DETAILS', margin + 7, y + 6)
    y += 12

    doc.setFillColor(...bgColor)
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F')

    const paymentY = y + 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)

    doc.text('Base fare', margin + 5, paymentY)
    doc.text(`₹${(booking.payment.base || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY, { align: 'right' })

    doc.text('Taxes & fees', margin + 5, paymentY + 7)
    doc.text(`₹${(booking.payment.taxes || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 7, { align: 'right' })

    doc.text('Convenience fee', margin + 5, paymentY + 14)
    doc.text('₹99', pageWidth - margin - 5, paymentY + 14, { align: 'right' })

    // Add-ons
    let addonOffset = 0
    if (booking.addons && booking.addons.length > 0) {
      booking.addons.forEach((a, i) => {
        doc.text(a.name, margin + 5, paymentY + 21 + (i * 7))
        doc.text(`₹${(a.price || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 21 + (i * 7), { align: 'right' })
      })
      addonOffset = booking.addons.length * 7
    }

    // Total line
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.3)
    doc.line(margin + 5, paymentY + 28 + addonOffset, pageWidth - margin - 5, paymentY + 28 + addonOffset)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...darkColor)
    doc.text('Total amount', margin + 5, paymentY + 34 + addonOffset)
    doc.text(`₹${((booking.payment.paid || 0) + 99).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 34 + addonOffset, { align: 'right' })

    // Payment status
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...greenColor)
    doc.text(`✓ Paid via ${booking.payment.method || 'N/A'}`, margin + 5, paymentY + 38 + addonOffset)

    y += 45
  }

  y += 5

  // ── Barcode Section ──
  if (y < pageHeight - 30) {
    doc.setFillColor(...bgColor)
    doc.roundedRect(margin, y, contentWidth, 18, 3, 3, 'F')

    // Simple barcode representation
    const barcodeY = y + 3
    const barcodeX = margin + 5
    const barcodeValue = booking.pnr || booking.ref || 'TKT000'
    let bx = barcodeX
    for (let i = 0; i < barcodeValue.length && bx < pageWidth - margin - 30; i++) {
      const code = barcodeValue.charCodeAt(i)
      const barW = 1 + (code % 3) * 0.5
      if (i % 2 === 0) {
        doc.setFillColor(...darkColor)
        doc.rect(bx, barcodeY, barW, 10, 'F')
      }
      bx += barW + 0.5
    }

    doc.setTextColor(...grayColor)
    doc.setFontSize(7)
    doc.text(barcodeValue, barcodeX, barcodeY + 14)
    doc.text('Scan at airport kiosk', pageWidth - margin - 5, barcodeY + 14, { align: 'right' })

    y += 25
  }

  // ── Travel Instructions ──
  if (y < pageHeight - 40) {
    doc.setFillColor(...amberColor)
    doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')
    doc.setTextColor(...darkColor)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('TRAVEL INSTRUCTIONS', margin + 7, y + 6)
    y += 10

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    const instructions = [
      'Arrive at airport 2 hours (domestic) or 3 hours (international) before departure.',
      'Carry a valid government-issued photo ID for identity verification.',
      'Web check-in opens 48 hours before departure.',
      'Ensure carry-on baggage does not exceed weight limits.',
      'Keep this e-ticket and ID ready at the security checkpoint.',
    ]
    instructions.forEach((inst, i) => {
      if (y + i * 5 < pageHeight - 15) {
        doc.text(`${i + 1}. ${inst}`, margin + 5, y + i * 5)
      }
    })

    y += instructions.length * 5 + 5
  }

  // ── Footer ──
  if (y < pageHeight - 15) {
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text('This is a computer-generated e-ticket. No signature is required.', margin, y)
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y + 4)
    doc.text('AkbarBizvoy — Corporate Travel Solutions', pageWidth - margin, y + 4, { align: 'right' })
  }

  return doc
}

/**
 * Download the generated PDF.
 * @param {Object} booking - The booking object
 * @param {'ticket'|'invoice'} type - What to generate
 */

/**
 * Trigger a file download in the browser.
 * Uses a data URI approach which works across all browsers and scenarios
 * (async handlers, pop-up blockers, blob URL restrictions).
 */
function triggerDownload(dataUri, filename) {
  const link = document.createElement('a')
  link.href = dataUri
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  // Delay removal so the browser has time to process the download
  setTimeout(() => {
    document.body.removeChild(link)
  }, 500)
}

/**
 * Download the generated PDF.
 * @param {Object} booking - The booking object
 * @param {'ticket'|'invoice'} type - What to generate
 * @returns {{ success: boolean, filename?: string, error?: string }}
 */
export function downloadTicket(booking, type = 'ticket') {
  const pnr = booking.pnr || 'booking'
  const filename = type === 'invoice'
    ? `Invoice-${pnr}.pdf`
    : `E-Ticket-${pnr}.pdf`

  try {
    const doc = generateTicketPDF(booking, type)
    // Convert to a data URI string (data:application/pdf;base64,...)
    // This approach is more reliable than blob URLs because:
    // 1. Works even in async React handlers where user gesture context is lost
    // 2. Not affected by Content Security Policy restrictions on blob: URLs
    // 3. Works with the `download` attribute in all modern browsers
    const dataUri = doc.output('datauristring')
    if (!dataUri || !dataUri.startsWith('data:')) {
      throw new Error('Failed to generate PDF data')
    }
    triggerDownload(dataUri, filename)
    return { success: true, filename }
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}
