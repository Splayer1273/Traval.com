import { useCurrency } from '../context/CurrencyContext.jsx'
import { convert, formatMoney } from '../utils/format.js'

/** Format an INR amount in the active display currency. */
export function usePrice() {
  const { currency } = useCurrency()
  return (amountInr) => formatMoney(convert(amountInr, currency), currency)
}
