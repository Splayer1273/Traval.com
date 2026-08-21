import { cn } from '../../lib/utils.js'

/**
 * Sticky bottom action bar for mobile (MakeMyTrip/Booking.com style).
 * Shows the price plus the primary CTA so travellers can act without
 * scrolling back up. Hidden on md+ where the inline sidebar is visible.
 */
export default function MobileActionBar({ price, sub, buttonText, icon, onClick, disabled = false, className }) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 animate-slide-up border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_-12px_rgb(15_23_42/0.25)] backdrop-blur-lg md:hidden',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          {sub && (
            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {sub}
            </p>
          )}
          <div className="flex min-w-0 items-baseline gap-1">{price}</div>
        </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-5 text-sm font-bold text-white shadow-glow transition-all hover:from-sun-600 hover:to-sun-700 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60"
        >
          {icon}
          {buttonText}
        </button>
      </div>
    </div>
  )
}
