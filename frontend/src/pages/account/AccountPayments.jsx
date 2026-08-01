import { useState } from 'react'
import { CreditCard, Plus, Trash2, Landmark, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { DEMO_USER } from '../../data/users.js'

const BRANDS = [
  { id: 'visa', label: 'Visa', color: '#1a1f71' },
  { id: 'mastercard', label: 'Mastercard', color: '#eb001b' },
  { id: 'rupay', label: 'RuPay', color: '#04508c' },
  { id: 'amex', label: 'Amex', color: '#006fcf' },
]

export default function AccountPayments() {
  const { toast, error } = useToast()
  const { user } = useAuth()
  const data = user?.payments || DEMO_USER.payments
  const [cards, setCards] = useState(data.cards)
  const [upis, setUpis] = useState(data.upi)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ number: '', expiry: '', cvv: '', name: '', brand: 'visa' })
  const [upiId, setUpiId] = useState('')

  const addCard = () => {
    const num = form.number.replace(/\s/g, '')
    if (num.length !== 16) return error('Card number must be 16 digits. Demo only — never enter a real card here.', 'Add card')
    if (!form.expiry || !form.cvv) return error('Please complete all card fields.', 'Add card')
    const brand = BRANDS.find((b) => b.id === form.brand)
    setCards([...cards, { id: `c${Date.now()}`, brand: brand.label, last4: num.slice(-4), expiry: form.expiry, name: form.name.toUpperCase() }])
    setForm({ number: '', expiry: '', cvv: '', name: '', brand: 'visa' })
    setOpen(false)
    toast('Card added. Only the last 4 digits are stored — never the full number.', 'Payment method saved')
  }

  const addUpi = () => {
    if (!/^[\w.-]+@[a-zA-Z]+$/.test(upiId)) return error('Enter a valid UPI ID, e.g. name@okhdfc', 'Add UPI')
    setUpis([...upis, { id: `u${Date.now()}`, handle: upiId, bank: 'Verified' }])
    setUpiId('')
    toast('UPI ID verified and linked to your account.', 'UPI linked')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-brand-600" /> Saved cards</CardTitle>
          <CardDescription>Tokenised references only — full card numbers are never stored.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((c) => (
              <div key={c.id} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-5 text-white shadow-card">
                <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/5" />
                <div className="absolute -right-2 top-4 size-16 rounded-full bg-white/10" />
                <p className="font-mono text-xs tracking-widest text-slate-300">•••• •••• •••• {c.last4}</p>
                <p className="mt-4 text-sm font-bold">{c.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Expires {c.expiry}</p>
                  <span className="flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase">{c.brand}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCards(cards.filter((x) => x.id !== c.id))}
                  className="absolute right-3 top-3 rounded-lg bg-white/10 p-1.5 text-slate-300 transition-colors hover:bg-rose-500 hover:text-white"
                  aria-label="Remove card"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="mt-4"><Plus className="size-4" /> Add card</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a payment card</DialogTitle>
                <DialogDescription>Demo environment — do not enter real card details. We only ever store the last 4 digits.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>Card type</Label>
                  <Select value={form.brand} onValueChange={(v) => setForm((f) => ({ ...f, brand: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => <SelectItem key={b.id} value={b.id}>{b.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Card number</Label><Input className="mt-1.5 font-mono" placeholder="4242 4242 4242 4242" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Expiry</Label><Input className="mt-1.5" placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))} /></div>
                  <div><Label>CVV</Label><Input type="password" className="mt-1.5" placeholder="•••" value={form.cvv} onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value }))} /></div>
                </div>
                <div><Label>Name on card</Label><Input className="mt-1.5" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <Button onClick={addCard}>Save card</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Smartphone className="size-5 text-brand-600" /> UPI IDs</CardTitle>
          <CardDescription>Link UPI handles for one-tap payments at checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upis.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-mono text-sm font-bold text-slate-800">{u.handle}</p>
                  <p className="text-xs text-slate-500">{u.bank}</p>
                </div>
                <Button size="icon" variant="ghost" className="size-8 text-rose-500 hover:bg-rose-50" onClick={() => setUpis(upis.filter((x) => x.id !== u.id))} aria-label="Remove UPI">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okhdfc" className="font-mono" />
            <Button variant="secondary" onClick={addUpi}>Link UPI</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Landmark className="size-5 text-brand-600" /> Billing address</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Default billing address</Label>
          <Input className="mt-1.5" defaultValue={data.billingAddress} />
          <p className="mt-2 text-xs text-slate-400">Used for invoices and GST receipts.</p>
        </CardContent>
      </Card>
    </div>
  )
}
