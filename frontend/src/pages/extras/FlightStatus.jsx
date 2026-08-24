import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Plane, CheckCircle2, Clock, MapPin } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { flightApi } from '../../services/flightApi.js'
import { formatTime, formatDate } from '../../utils/format.js'

const SUGGESTIONS = ['6E-201', 'AI-864', 'EK-501', 'UK-911', 'SQ-423']

export default function FlightStatus() {
  const [flightNumber, setFlightNumber] = useState('')
  const [query, setQuery] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['flightStatus', query],
    queryFn: () => flightApi.getFlightStatus(query),
    enabled: !!query,
  })

  const search = (e) => {
    e?.preventDefault()
    if (flightNumber.trim()) setQuery(flightNumber.trim().toUpperCase())
  }

  return (
    <div>
      <PageHero image="airport" title="Flight Status" subtitle="Track any Akbar Bizvoy flight in real time" crumb={[{ label: 'Flight Status' }]} />

      <div className="container-x mt-8">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Plane className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} placeholder="Enter flight number, e.g. 6E-201" className="pl-10 font-mono uppercase" />
              </div>
              <Button type="submit"><Search className="size-4" /> Track flight</Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => { setFlightNumber(s); setQuery(s) }} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-700">
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto mt-8 max-w-2xl">
          {isLoading && <Skeleton className="h-64 w-full rounded-2xl" />}
          {isError && <p className="rounded-2xl bg-rose-50 p-4 text-center text-sm text-rose-600">We couldn't track that flight. Please check the flight number and try again.</p>}
          {data && (
            <Card className="animate-fade-up overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
                <div>
                  <p className="font-mono text-xl font-bold">{data.flightNumber}</p>
                  <p className="text-sm text-brand-100">{data.airline} · {data.aircraft}</p>
                </div>
                <Badge className="bg-emerald-400 text-emerald-950">
                  <CheckCircle2 className="size-3" /> {data.status}
                </Badge>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-slate-900">{formatTime(data.scheduledDep)}</p>
                    <p className="flex items-center gap-1 text-sm font-bold text-slate-700"><MapPin className="size-3.5" /> {data.origin.code} · {data.origin.city}</p>
                    <p className="text-xs text-slate-400">{formatDate(data.scheduledDep)} · Terminal {data.terminal} · Gate {data.gate}</p>
                  </div>
                  <div className="hidden flex-1 flex-col items-center sm:flex">
                    <div className="relative h-px w-full bg-slate-200">
                      <Plane className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-90 text-brand-500" />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400"><Clock className="size-3" /> Scheduled · On time</p>
                  </div>
                  <div className="flex-1 sm:text-right">
                    <p className="text-2xl font-bold text-slate-900">{formatTime(data.scheduledArr)}</p>
                    <p className="flex items-center gap-1 text-sm font-bold text-slate-700 sm:justify-end"><MapPin className="size-3.5" /> {data.destination.code} · {data.destination.city}</p>
                    <p className="text-xs text-slate-400">{formatDate(data.scheduledArr)} · On time</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 text-center">
                  {[
                    { label: 'Check-in', value: data.checkedIn ? 'Open' : 'Not open' },
                    { label: 'Departure gate', value: data.gate },
                    { label: 'Status', value: data.status },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">{s.value}</p>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => refetch()} className="mt-4 w-full text-center text-xs font-semibold text-brand-600 hover:underline">
                  Refresh status
                </button>
              </CardContent>
            </Card>
          )}
          {!query && !isLoading && (
            <p className="text-center text-sm text-slate-400">Enter a flight number to see live status, gate and terminal information.</p>
          )}
        </div>
      </div>
    </div>
  )
}
