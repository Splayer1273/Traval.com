import { jsPDF } from 'jspdf'
import { formatDate, formatTime, fullName } from './format.js'

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
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Colors
  const brandColor = [43, 69, 240] // brand-600
  const darkColor = [15, 23, 42] // slate-900
  const grayColor = [100, 116, 139] // slate-500
  const lightGray = [226, 232, 240] // slate-200
  const greenColor = [16, 185, 129] // emerald-500

  // Header background
  doc.setFillColor(...brandColor)
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Brand name
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('AkbarBizvoy', margin, y + 15)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Corporate Travel Solutions', margin, y + 22)

  // Document type
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  const docTitle = type === 'invoice' ? 'INVOICE' : 'E-TICKET'
  doc.text(docTitle, pageWidth - margin, y + 15, { align: 'right' })

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Ref: ${booking.ref || 'N/A'}`, pageWidth - margin, y + 22, { align: 'right' })
  doc.text(`PNR: ${booking.pnr || 'N/A'}`, pageWidth - margin, y + 28, { align: 'right' })

  y = 55

  // Booking reference section
  doc.setFillColor(248, 250, 252) // slate-50
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F')

  doc.setTextColor(...darkColor)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('BOOKING REFERENCE', margin + 5, y + 8)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(booking.ref || 'N/A', margin + 5, y + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('STATUS', pageWidth / 2 + 5, y + 8)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...greenColor)
  doc.text('CONFIRMED', pageWidth / 2 + 5, y + 16)

  y += 30

  // Trip details
  if (booking.type === 'flight' && booking.summary) {
    // Section title
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('FLIGHT DETAILS', margin, y)
    y += 8

    // Flight info box
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F')

    // Departure
    doc.setTextColor(...darkColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(formatTime(booking.summary.dep), margin + 5, y + 12)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.from?.code || '', margin + 5, y + 18)
    doc.text(booking.summary.from?.city || '', margin + 5, y + 23)
    doc.text(formatDate(booking.summary.dep), margin + 5, y + 28)

    // Flight line
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(margin + 45, y + 15, pageWidth - margin - 45, y + 15)

    // Plane icon (simple triangle)
    doc.setFillColor(...brandColor)
    const planeX = pageWidth / 2
    doc.triangle(planeX - 2, y + 13, planeX + 2, y + 15, planeX - 2, y + 17, 'F')

    doc.setFontSize(7)
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.airline || '', planeX, y + 22, { align: 'center' })
    doc.text(booking.summary.cabin || '', planeX, y + 27, { align: 'center' })

    // Arrival
    doc.setTextColor(...darkColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(formatTime(booking.summary.arr), pageWidth - margin - 5, y + 12, { align: 'right' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text(booking.summary.to?.code || '', pageWidth - margin - 5, y + 18, { align: 'right' })
    doc.text(booking.summary.to?.city || '', pageWidth - margin - 5, y + 23, { align: 'right' })
    doc.text(formatDate(booking.summary.arr), pageWidth - margin - 5, y + 28, { align: 'right' })

    y += 42
  } else if (booking.type === 'hotel' && booking.summary) {
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('HOTEL DETAILS', margin, y)
    y += 8

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y, contentWidth, 25, 3, 3, 'F')

    doc.setTextColor(...darkColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(booking.summary.hotel || booking.title || 'Hotel', margin + 5, y + 10)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)
    doc.text(`${booking.summary.room || ''} · ${booking.summary.nights || ''} nights · ${booking.summary.board || ''}`, margin + 5, y + 17)
    doc.text(`Check-in: ${formatDate(booking.summary.checkIn)} · Check-out: ${formatDate(booking.summary.checkOut)}`, margin + 5, y + 22)

    y += 32
  }

  // Passengers
  doc.setTextColor(...brandColor)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(type === 'invoice' ? 'PASSENGER DETAILS' : 'PASSENGER(S)', margin, y)
  y += 8

  if (booking.passengers && booking.passengers.length > 0) {
    booking.passengers.forEach((p, i) => {
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, 'F')

      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(fullName(p), margin + 5, y + 7)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...grayColor)
      const details = [
        p.gender || p.type || 'Guest',
        p.seat ? `Seat ${p.seat}` : '',
        p.room ? p.room : '',
      ].filter(Boolean).join(' · ')
      doc.text(details, margin + 70, y + 7)

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

  // Payment details
  if (booking.payment) {
    doc.setTextColor(...brandColor)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT DETAILS', margin, y)
    y += 8

    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F')

    const paymentY = y + 8
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...grayColor)

    doc.text('Base fare', margin + 5, paymentY)
    doc.text(`₹${(booking.payment.base || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY, { align: 'right' })

    doc.text('Taxes & fees', margin + 5, paymentY + 7)
    doc.text(`₹${(booking.payment.taxes || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 7, { align: 'right' })

    // Add-ons
    if (booking.addons && booking.addons.length > 0) {
      booking.addons.forEach((a, i) => {
        doc.text(a.name, margin + 5, paymentY + 14 + (i * 7))
        doc.text(`₹${(a.price || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 14 + (i * 7), { align: 'right' })
      })
    }

    // Total
    doc.setDrawColor(...lightGray)
    doc.line(margin + 5, paymentY + 21, pageWidth - margin - 5, paymentY + 21)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...darkColor)
    doc.text('Total paid', margin + 5, paymentY + 27)
    doc.text(`₹${(booking.payment.paid || 0).toLocaleString('en-IN')}`, pageWidth - margin - 5, paymentY + 27, { align: 'right' })

    y += 37
  }

  y += 5

  // Footer
  doc.setDrawColor(...lightGray)
  doc.line(margin, y, pageWidth - margin, y)
  y += 5

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...grayColor)
  doc.text('This is a computer-generated e-ticket. No signature is required.', margin, y)
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y + 4)
  doc.text('AkbarBizvoy — Corporate Travel Solutions', pageWidth - margin, y + 4, { align: 'right' })

  return doc
}

/**
 * Download the generated PDF.
 * @param {Object} booking - The booking object
 * @param {'ticket'|'invoice'} type - What to generate
 */
export function downloadTicket(booking, type = 'ticket') {
  try {
    const doc = generateTicketPDF(booking, type)
    const filename = `Akbar-BizVoy-${type === 'invoice' ? 'Invoice' : 'E-Ticket'}-${booking.pnr || booking.ref || 'booking'}.pdf`
    doc.save(filename)
    return { success: true, filename }
  } catch (error) {
    console.error('Failed to generate PDF:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}
