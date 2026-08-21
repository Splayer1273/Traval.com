import { Link } from 'react-router-dom'
import {
  Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin,
  ShieldCheck, CreditCard, BadgeCheck,
} from 'lucide-react'
import Logo from './Logo.jsx'

const COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Why Us', to: '/why-us' },
      { label: 'Features', to: '/features' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Blogs', to: '/guides' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Flight Booking', to: '/services#flights' },
      { label: 'Accommodation', to: '/services#accommodation' },
      { label: 'Car Transfer', to: '/services#transfers' },
      { label: 'Travel Insurance', to: '/services#insurance' },
      { label: 'Visa Services', to: '/services#visa' },
      { label: 'MICE', to: '/services#mice' },
      { label: 'Meet & Greet', to: '/services#meet-greet' },
      { label: 'VIP Charter', to: '/services#vip-charter' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Business Leaders', to: '/solutions#business-leaders' },
      { label: 'Travel Coordinators', to: '/solutions#travel-coordinators' },
      { label: 'Finance Teams', to: '/solutions#finance-teams' },
      { label: 'Employees', to: '/solutions#employees' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: '+971 4356 1222', to: 'tel:+97143561222', isExternal: true },
      { label: 'corp.support@akbarBizvoy.com', to: 'mailto:corp.support@akbarBizvoy.com', isExternal: true },
      { label: 'Office 303, Al Fajer Complex', to: '#', isExternal: true },
      { label: 'Oud Metha, Dubai, UAE', to: '#', isExternal: true },
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
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Smart Corporate Travel Solutions for Modern Businesses
          </p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-slate-500">
            AkbarBizvoy is the corporate travel division of the Akbar Group, providing businesses with professional travel services, technology-enabled travel management and dedicated corporate support.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" onClick={(e) => e.preventDefault()} aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-sun-500 hover:bg-sun-500 hover:text-white">
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
                  {l.isExternal ? (
                    <a href={l.to} className="text-sm text-slate-400 transition-colors hover:text-sun-400"
                      {...(l.to.startsWith('mailto:') || l.to.startsWith('tel:') ? {} : { onClick: (e) => e.preventDefault() })}>
                      {l.label}
                    </a>
                  ) : (
                    <Link to={l.to} className="text-sm text-slate-400 transition-colors hover:text-sun-400">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-slate-500">© 2026 Akbar Travels of India. All Rights Reserved.</p>
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
