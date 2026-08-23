import { Link } from 'react-router-dom'
import { Compass, Home, Search, Plane } from 'lucide-react'
import { Button } from '../components/ui/button.jsx'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center sm:min-h-[70vh] sm:py-20">
      <div className="animate-float">
        <Compass className="size-16 text-brand-200 sm:size-24" />
      </div>
      <p className="mt-4 font-mono text-xs font-bold tracking-[0.3em] text-sun-600 sm:text-sm">ERROR 404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-4xl">This page took a detour</h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">
        The page you're looking for doesn't exist or has moved. Let's get you back on the right flight path.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild><Link to="/"><Home className="size-4" /> Back home</Link></Button>
        <Button size="lg" variant="secondary" asChild><Link to="/flights"><Search className="size-4" /> Search flights</Link></Button>
        <Button size="lg" variant="ghost" asChild><Link to="/destinations"><Plane className="size-4" /> Explore destinations</Link></Button>
      </div>
    </div>
  )
}
