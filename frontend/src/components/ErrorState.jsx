import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button.jsx'

export default function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-14 text-center">
      <div className="rounded-2xl bg-rose-100 p-4 text-rose-500">
        <AlertTriangle className="size-10" />
      </div>
      <h3 className="font-display text-lg font-semibold text-rose-800">We hit a snag</h3>
      <p className="max-w-sm text-sm text-rose-600">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-1 border-rose-200 text-rose-700 hover:bg-rose-100" onClick={onRetry}>
          <RefreshCw className="size-4" /> Try again
        </Button>
      )}
    </div>
  )
}
