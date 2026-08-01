import { usePrice } from '../hooks/usePrice.js'

/** Render an INR amount in the active display currency. */
export function Price({ amount, className, suffix }) {
  const fmt = usePrice()
  return (
    <span className={className}>
      {fmt(amount)}
      {suffix ? <span className="text-xs font-normal text-slate-400">{suffix}</span> : null}
    </span>
  )
}
