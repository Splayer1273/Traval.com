import { useState } from 'react'
import { SlidersHorizontal, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import { Label } from '../../components/ui/label.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useCurrency } from '../../context/CurrencyContext.jsx'
import { CURRENCIES, LANGUAGES } from '../../data/currencies.js'
import { AIRLINES } from '../../data/airlines.js'

export default function AccountPreferences() {
  const { toast } = useToast()
  const { setCurrency } = useCurrency()
  const [prefs, setPrefs] = useState({
    airlines: ['singapore', 'emirates'],
    cabin: 'Economy',
    hotelRating: '4',
    seat: 'Window',
    meal: 'Vegetarian',
    currency: 'INR',
    language: 'en',
  })

  const set = (k, v) => setPrefs((p) => ({ ...p, [k]: v }))

  const save = () => {
    setCurrency(prefs.currency)
    toast('Your travel preferences have been saved and will be pre-filled at checkout.', 'Preferences saved')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="size-5 text-brand-600" /> Travel preferences</CardTitle>
          <CardDescription>We'll use these to personalise search results and pre-fill your bookings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Preferred airlines</Label>
            <Select value={prefs.airlines[0]} onValueChange={(v) => set('airlines', [v])}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {AIRLINES.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred cabin class</Label>
            <Select value={prefs.cabin} onValueChange={(v) => set('cabin', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="First Class">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred hotel rating</Label>
            <Select value={prefs.hotelRating} onValueChange={(v) => set('hotelRating', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5-star & above</SelectItem>
                <SelectItem value="4">4-star & above</SelectItem>
                <SelectItem value="3">3-star & above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Seat preference</Label>
            <Select value={prefs.seat} onValueChange={(v) => set('seat', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Window">Window</SelectItem>
                <SelectItem value="Aisle">Aisle</SelectItem>
                <SelectItem value="Middle">Middle</SelectItem>
                <SelectItem value="Any">No preference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Meal preference</Label>
            <Select value={prefs.meal} onValueChange={(v) => set('meal', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Non-vegetarian">Non-vegetarian</SelectItem>
                <SelectItem value="Jain">Jain</SelectItem>
                <SelectItem value="Halal">Halal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Display currency</Label>
            <Select value={prefs.currency} onValueChange={(v) => set('currency', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(CURRENCIES).map((c) => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={prefs.language} onValueChange={(v) => set('language', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => <SelectItem key={l.code} value={l.code}>{l.flag} {l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={save}><Save className="size-4" /> Save preferences</Button>
      </div>
    </div>
  )
}
