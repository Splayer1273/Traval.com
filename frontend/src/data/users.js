export const DEMO_USER = {
  id: 'u_demo',
  firstName: 'Aarav',
  lastName: 'Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  dob: '1992-06-14',
  gender: 'Male',
  nationality: 'Indian',
  avatar: null,
  memberSince: '2024-11-02',
  preferences: {
    currency: 'INR',
    language: 'en',
    preferredAirlines: ['singapore', 'emirates'],
    cabinClass: 'Economy',
    hotelRating: 4,
    seat: 'Window',
    meal: 'Vegetarian',
  },
  security: {
    twoFactor: true,
    sessions: [
      { device: 'Chrome · Windows', location: 'Mumbai, IN', active: true, lastActive: '2 minutes ago' },
      { device: 'Safari · iPhone', location: 'Mumbai, IN', active: false, lastActive: '3 days ago' },
    ],
    loginHistory: [
      { date: '2026-08-01 09:42', device: 'Chrome · Windows', location: 'Mumbai, IN', status: 'Success' },
      { date: '2026-07-29 22:15', device: 'Safari · iPhone', location: 'Mumbai, IN', status: 'Success' },
      { date: '2026-07-25 08:03', device: 'Chrome · Windows', location: 'Mumbai, IN', status: 'Success' },
      { date: '2026-07-20 14:37', device: 'Firefox · macOS', location: 'Bengaluru, IN', status: 'Failed' },
    ],
  },
  payments: {
    cards: [
      { id: 'c1', brand: 'Visa', last4: '4242', expiry: '08/28', name: 'AARAV SHARMA' },
      { id: 'c2', brand: 'Mastercard', last4: '1122', expiry: '03/27', name: 'AARAV SHARMA' },
    ],
    upi: [{ id: 'u1', handle: 'aarav@okhdfc', bank: 'HDFC Bank' }],
    billingAddress: '14, Marine Drive, Mumbai 400020',
  },
  notifications: {
    bookingUpdates: true,
    flightUpdates: true,
    priceAlerts: true,
    promotional: false,
    sms: true,
    push: true,
  },
}

export const NOTIFICATIONS = [
  { id: 'n1', type: 'price', title: 'Price drop on Mumbai → Dubai', text: 'Emirates EK-501 is now ₹16,999 — 12% below the average.', time: '12 min ago', read: false },
  { id: 'n2', type: 'booking', title: 'Booking confirmed — SR-8K3M2A', text: 'Your Mumbai → Delhi flight is confirmed. Happy travels!', time: '3 hrs ago', read: false },
  { id: 'n3', type: 'offer', title: 'Weekend getaway ₹9,999', text: 'Kashmir, Goa & Kerala weekend packages are live with 30% off.', time: 'Yesterday', read: false },
  { id: 'n4', type: 'checkin', title: 'Check-in opens soon', text: 'Web check-in for UK-911 opens in 24 hours.', time: '2 days ago', read: true },
  { id: 'n5', type: 'promo', title: 'Save ₹5,000 on hotels', text: 'Use STAY5000 on 5-star stays above ₹20,000.', time: '4 days ago', read: true },
]
