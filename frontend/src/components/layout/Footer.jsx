import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube, Send, Mail, Phone, MapPin,
  ShieldCheck, CreditCard, BadgeCheck,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Corporate Travel',
    links: [
      { label: 'Search Flights', to: '/flights' },
      { label: 'Search Hotels', to: '/hotels' },
      { label: 'My Trips', to: '/my-trips' },
      { label: 'Travel Policy', to: '/admin/policies' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Cancellation', to: '/cancellation' },
      { label: 'Refunds', to: '/cancellation' },
      { label: 'Contact Support', to: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/privacy' },
    ],
  },
]

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'X' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Youtube, label: 'YouTube' },
]

export default function Footer() {
  const { success } = useToast()
  const [email, setEmail] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      success('Please enter a valid email address.', 'Newsletter')
      return
    }
    success('You are subscribed! Watch your inbox for travel deals.', 'Newsletter')
    setEmail('')
  }

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-5 py-8 lg:flex-row">
          <div className="text-center lg:text-left">
            <h3 className="font-display text-xl font-semibold text-white">Corporate travel desk</h3>
            <p className="mt-1 text-sm text-slate-400">Policy questions, booking help or urgent approvals — our travel desk is available 24×7 for Acme employees.</p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email for travel updates"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/40"
              />
            </div>
            <button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-5 text-sm font-bold text-white transition-all hover:from-sun-600 hover:to-sun-700">
              <Send className="size-4" /> Sign up
            </button>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Project Sunrise is the corporate travel platform for Acme Technologies — policy-aware flight & hotel booking, manager approvals and spend control in one place.
          </p>
          <div className="mt-5 space-y-2 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Phone className="size-4 text-sun-500" /> +91 1800 419 4200 (24×7)</p>
            <p className="flex items-center gap-2"><Mail className="size-4 text-sun-500" /> support@sunrise.travel</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-sun-500" /> Mumbai, India</p>
          </div>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-sun-500 hover:bg-sun-500 hover:text-white"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-sun-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 Project Sunrise · Corporate Travel Management for Acme Technologies Pvt. Ltd.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-emerald-400" /> Secure 256-bit payments</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-brand-400" /> IATA Accredited</span>
            <span className="flex items-center gap-1.5"><CreditCard className="size-4 text-sun-400" /> Visa · MC · RuPay · UPI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
