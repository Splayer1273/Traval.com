import { delay } from '../lib/api.js'

/**
 * Payment service — mock gateway. Card numbers are tokenised placeholders
 * only; real cards are never stored anywhere in the frontend.
 */
export const paymentApi = {
  async processPayment({ method, amount, details }) {
    // Real: return (await api.post('/payments', payload)).data
    await delay(1400)
    if (!details) throw new Error('Please complete your payment details.')
    if (method === 'card') {
      const num = (details.number || '').replace(/\s/g, '')
      if (num.length < 12) throw new Error('Please enter a valid card number.')
      if (!details.expiry) throw new Error('Please enter the card expiry.')
      if (!details.cvv || details.cvv.length < 3) throw new Error('Please enter a valid CVV.')
    }
    if (method === 'upi' && !details.upiId) throw new Error('Please enter your UPI ID.')
    if (method === 'netbanking' && !details.bank) throw new Error('Please choose your bank.')
    return {
      success: true,
      transactionId: `TXN${Date.now().toString(36).toUpperCase()}`,
      amount,
      method,
    }
  },

  async validatePromo(code) {
    await delay(500)
    const promos = {
      SUNRISE25: { type: 'percent', value: 25, label: '25% off' },
      STAY5000: { type: 'flat', value: 5000, label: '₹5,000 off' },
      TRIP15: { type: 'percent', value: 15, label: '15% off' },
      GOA40: { type: 'percent', value: 40, label: '40% off' },
      EARLY10: { type: 'percent', value: 10, label: '10% off' },
      WEEKEND30: { type: 'percent', value: 30, label: '30% off' },
    }
    const promo = promos[(code || '').toUpperCase().trim()]
    if (!promo) throw new Error('That promo code is invalid or has expired.')
    return promo
  },
}
