import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Headphones, BadgePercent } from 'lucide-react'
import Logo from './Logo.jsx'
import Img from '../Img.jsx'

const FEATURES = [
  { icon: ShieldCheck, title: 'Policy-first booking', text: 'Every flight and hotel is checked against your company travel policy.' },
  { icon: BadgePercent, title: 'Approval workflow built in', text: 'Requests reach your manager with purpose, cost and compliance context.' },
  { icon: Headphones, title: 'Corporate travel desk', text: 'Dedicated 24×7 support for employees and travel administrators.' },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Img src="plane" alt="Sunrise travel" className="absolute inset-0" eager />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950/90 via-slate-950/70 to-sun-700/60" />
        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Logo light />
          <div>
            <p className="max-w-md font-display text-4xl font-semibold leading-tight">
              Business travel, approval-ready.
            </p>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              The corporate travel portal for Acme Technologies — plan official trips, stay within policy and get manager approval in a few clicks.
            </p>
            <div className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="rounded-xl bg-white/10 p-2 backdrop-blur">
                    <f.icon className="size-4 text-sun-400" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-slate-300">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400">© 2026 Project Sunrise · Corporate Travel Management</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-700">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
