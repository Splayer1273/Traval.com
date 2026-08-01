import { useState } from 'react'
import { ArrowLeftRight, TrendingUp, Globe2 } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import { CURRENCIES } from '../../data/currencies.js'
import { formatMoney } from '../../utils/format.js'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(10000)
  const [from, setFrom] = useState('INR')
  const [to, setTo] = useState('USD')

  const rate = CURRENCIES[from].rate / CURRENCIES[to].rate
  const result = amount * rate
  const inverse = 1 / rate

  return (
    <div>
      <PageHero image="shopping" title="Currency Converter" subtitle="Check live exchange rates for your next trip" crumb={[{ label: 'Currency Converter' }]} />

      <div className="container-x mt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">Amount</label>
                  <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="text-lg font-bold" min="0" />
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">From</label>
                    <Select value={from} onValueChange={setFrom}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(CURRENCIES).map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFrom(to); setTo(from) }}
                    className="mb-1 flex size-10 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition-transform hover:rotate-180"
                    aria-label="Swap currencies"
                  >
                    <ArrowLeftRight className="size-4" />
                  </button>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">To</label>
                    <Select value={to} onValueChange={setTo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(CURRENCIES).map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
            <CardContent className="flex flex-col justify-center gap-2 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">
                {CURRENCIES[from].flag} {formatMoney(amount, from)} =
              </p>
              <p className="font-display text-4xl font-bold sm:text-5xl">
                {CURRENCIES[to].symbol}{result.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-sm text-brand-100">
                1 {from} = {inverse.toFixed(4)} {to} · 1 {to} = {rate.toFixed(4)} {from}
              </p>
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-xs text-brand-100 backdrop-blur">
                <TrendingUp className="size-4 text-sun-300" /> Rates refresh daily and are indicative for travel planning.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
              <Globe2 className="size-5 text-brand-600" /> Popular rates
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {Object.values(CURRENCIES).filter((c) => c.code !== 'INR').slice(0, 6).map((c) => (
                <div key={c.code} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">{c.flag} 1 {from}</span>
                  <span className="text-sm font-bold text-slate-900">
                    {CURRENCIES[from].rate === 0 ? '—' : `${c.symbol}${(1 / (CURRENCIES[from].rate / c.rate)).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
