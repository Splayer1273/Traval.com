import { useState } from 'react'
import { CheckCircle2, ClipboardCheck } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import Checklist from '../../components/Checklist.jsx'

const GROUPS = [
  {
    title: 'Documents',
    items: ['Passport (6+ months validity)', 'Visas for all destinations', 'Travel insurance documents', 'Boarding passes & hotel confirmations', 'ID proofs (Aadhaar / Driving licence)', 'Vaccination certificates (if required)'],
  },
  {
    title: 'Money & payments',
    items: ['Cards with international usage enabled', 'Cash in local currency (small notes)', 'Currency converted for day 1', 'Travel card / forex card loaded', 'Copies of card helpline numbers'],
  },
  {
    title: 'Electronics',
    items: ['Phone charger + power bank', 'Universal travel adapter', 'Headphones / earbuds', 'Camera + memory cards', 'Noise-cancelling earplugs for flights'],
  },
  {
    title: 'Health & comfort',
    items: ['Prescription medicines (with slips)', 'First-aid kit (band-aids, pain relievers)', 'Motion sickness tablets', 'Sunscreen & lip balm', 'Comfortable walking shoes', 'Reusable water bottle'],
  },
  {
    title: 'Clothing',
    items: ['Weather-appropriate outfits', 'Light layers for flights', 'Swimwear (if applicable)', 'Modest clothing for temples', 'Rain jacket / poncho', 'Comfortable pyjamas'],
  },
  {
    title: 'Home prep',
    items: ['House keys with a neighbour', 'Pets cared for', 'Plants watered', 'Appliances unplugged', 'Mail on hold', 'Trash taken out'],
  },
]

export default function TravelChecklist() {
  const [checked, setChecked] = useState({})
  const allItems = GROUPS.flatMap((g) => g.items)

  const toggle = (gIdx, iIdx) => {
    let offset = 0
    for (let g = 0; g < gIdx; g++) offset += GROUPS[g].items.length
    const globalIdx = offset + iIdx
    setChecked((c) => ({ ...c, [globalIdx]: !c[globalIdx] }))
  }

  const pct = allItems.length ? Math.round((Object.values(checked).filter(Boolean).length / allItems.length) * 100) : 0

  return (
    <div>
      <PageHero image="luggage" title="Travel Checklist" subtitle="Pack smart and leave nothing behind" crumb={[{ label: 'Travel Checklist' }]} />

      <div className="container-x mt-8">
        <div className="mx-auto mb-8 max-w-xl rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-6 text-center text-white shadow-lift">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-200">
            <ClipboardCheck className="size-4" /> Trip readiness
          </p>
          <p className="mt-2 font-display text-4xl font-bold">{pct}%</p>
          <div className="mx-auto mt-3 h-2.5 max-w-xs overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-gradient-to-r from-sun-400 to-sun-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-brand-100">
            {Object.values(checked).filter(Boolean).length} of {allItems.length} items packed
            {pct === 100 && ' — you\'re all set! 🎒'}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, gIdx) => (
            <Checklist
              key={g.title}
              title={g.title}
              items={g.items}
              checked={g.items.map((_, iIdx) => {
                let offset = 0
                for (let g2 = 0; g2 < gIdx; g2++) offset += GROUPS[g2].items.length
                return !!checked[offset + iIdx]
              })}
              onToggle={(iIdx) => toggle(gIdx, iIdx)}
            />
          ))}
        </div>

        {pct === 100 && (
          <div className="mt-8 flex animate-fade-up items-center justify-center gap-2 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-5" /> Everything is packed. Bon voyage!
          </div>
        )}
      </div>
    </div>
  )
}
