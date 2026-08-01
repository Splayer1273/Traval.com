import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'

const SECTIONS = [
  { h: '1. Information we collect', p: 'We collect information you provide directly — such as your name, email, phone number, travel preferences and booking details — as well as usage data like device information and pages visited, to improve our services.' },
  { h: '2. How we use your information', p: 'Your information is used to process bookings, issue tickets and invoices, send trip updates and price alerts, provide customer support, prevent fraud, and (with your consent) send promotional offers.' },
  { h: '3. Payment security', p: 'Payments are processed by PCI-DSS compliant payment gateways over 256-bit TLS encryption. We store only a tokenised reference and the last four digits of your card — never the full number or CVV.' },
  { h: '4. Data sharing', p: 'We share booking-relevant information with airlines, hotels, tour operators, visa processors and payment partners solely to fulfil your bookings. We do not sell your personal data to third parties.' },
  { h: '5. Cookies & tracking', p: 'We use essential cookies to keep you signed in and functional cookies for analytics and personalisation. You can manage cookie preferences in your browser settings.' },
  { h: '6. Your rights', p: 'You may access, correct, export or delete your personal data at any time from your account settings or by contacting our data protection team at privacy@sunrise.travel.' },
  { h: '7. Data retention', p: 'Booking records are retained for the period required by law and for legitimate business purposes, after which they are securely deleted or anonymised.' },
  { h: '8. Contact', p: 'For privacy questions or concerns, contact our Data Protection Officer at privacy@sunrise.travel or write to us at 14, Marine Drive, Mumbai 400020.' },
]

export default function Privacy() {
  return (
    <div>
      <PageHero image="city" title="Privacy Policy" subtitle="Last updated: 1 August 2026" crumb={[{ label: 'Privacy Policy' }]} />
      <div className="container-x mt-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <p className="leading-relaxed text-slate-600">
              Your privacy matters to us. This policy explains what data we collect, why we collect it, and the choices you have.
            </p>
            {SECTIONS.map((s) => (
              <div key={s.h}>
                <h2 className="font-display text-lg font-semibold text-slate-900">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.p}</p>
              </div>
            ))}
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              Read our <Link to="/terms" className="font-semibold text-brand-600 hover:underline">Terms & Conditions</Link> or{' '}
              <Link to="/contact" className="font-semibold text-brand-600 hover:underline">contact us</Link> for more.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
