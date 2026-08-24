import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'

const SECTIONS = [
  { h: '1. Acceptance of terms', p: 'By accessing or using the Akbar Bizvoy website or app, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please discontinue use of the platform.' },
  { h: '2. Booking services', p: 'Akbar Bizvoy acts as an intermediary between travellers and airlines, hotels and tour operators. All bookings are subject to the terms, conditions and fare rules of the respective supplier, which are displayed before you confirm payment.' },
  { h: '3. Pricing & payments', p: 'All prices are shown in your selected currency and include applicable taxes unless stated otherwise. Payments are processed through PCI-DSS compliant gateways. We never store your full card details.' },
  { h: '4. Cancellation & refunds', p: 'Cancellation eligibility and refund amounts follow the fare rules of the booking, which are shown at checkout and on the booking detail page. Refunds are processed within 24–48 hours and typically reflect in 5–7 working days.' },
  { h: '5. Traveller responsibility', p: 'You are responsible for the accuracy of traveller details, passport validity, visa requirements and compliance with airline and immigration rules. Name changes are generally not permitted after booking.' },
  { h: '6. Content & intellectual property', p: 'All content on the platform — including text, imagery, logos and software — is the property of Akbar Bizvoy or its licensors and may not be reproduced without written consent.' },
  { h: '7. Limitation of liability', p: 'To the maximum extent permitted by law, Akbar Bizvoy is not liable for indirect or consequential losses arising from supplier failures, force majeure events, or third-party acts beyond our reasonable control.' },
  { h: '8. Changes to these terms', p: 'We may update these Terms from time to time. Material changes will be communicated by email or in-app notice. Continued use of the platform constitutes acceptance of the revised Terms.' },
]

export default function Terms() {
  return (
    <div>
      <PageHero image="city" title="Terms & Conditions" subtitle="Last updated: 1 August 2026" crumb={[{ label: 'Terms & Conditions' }]} />
      <div className="container-x mt-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <p className="leading-relaxed text-slate-600">
              Welcome to Akbar Bizvoy Travel & Explore Pvt. Ltd. ("Akbar Bizvoy", "we", "us"). These Terms govern your use
              of our booking platform and services. Please read them carefully — they include important information about your
              rights and responsibilities.
            </p>
            {SECTIONS.map((s) => (
              <div key={s.h}>
                <h2 className="font-display text-lg font-semibold text-slate-900">{s.h}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.p}</p>
              </div>
            ))}
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              Questions about these Terms? Contact us at{' '}
              <Link to="/contact" className="font-semibold text-brand-600 hover:underline">support@sunrise.travel</Link>.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
