export const REVIEWS = [
  { id: 'r1', hotelId: 'grand-mumbai', author: 'Rohan M.', avatar: null, rating: 5, date: '2026-07-18', title: 'Unbeatable sea views', text: 'Room 1408 had a full view of Marine Drive at sunset. The sky lounge is superb and the staff remembered our names all weekend.' },
  { id: 'r2', hotelId: 'grand-mumbai', author: 'Ananya K.', avatar: null, rating: 4, date: '2026-07-02', title: 'Great, but breakfast queues', text: 'Beautiful property and perfect location for a Gateway of India walk. Breakfast was busy on Sunday — go early.' },
  { id: 'r3', hotelId: 'grand-mumbai', author: 'David L.', avatar: null, rating: 5, date: '2026-06-24', title: 'World-class hospitality', text: 'Stayed here for business. The airport pickup, the WiFi and the gym were all top notch. Will book again.' },
  { id: 'r4', hotelId: 'taj-palace', author: 'Meera S.', avatar: null, rating: 5, date: '2026-07-12', title: 'A historic masterpiece', text: 'You feel the history the moment you walk in. The heritage tour they offer is a must. Best hotel experience in India.' },
  { id: 'r5', hotelId: 'taj-palace', author: 'James W.', avatar: null, rating: 5, date: '2026-06-30', title: 'Royal treatment', text: 'From the butler to the sea-facing suite, everything was flawless. The spa is genuinely world class.' },
  { id: 'r6', hotelId: 'oberoi-delhi', author: 'Kavita R.', avatar: null, rating: 5, date: '2026-07-21', title: 'Serene luxury in Delhi', text: 'Overlooking the golf course, it feels a world away from the city chaos. Michelin-starred Thai restaurant is unforgettable.' },
  { id: 'r7', hotelId: 'marina-bay-singapore', author: 'Priya T.', avatar: null, rating: 4, date: '2026-07-08', title: 'The SkyPark is worth it', text: 'The infinity pool view is everything they say. Rooms are comfortable; check-in lines can be long in the afternoon.' },
  { id: 'r8', hotelId: 'dubai-grand', author: 'Omar F.', avatar: null, rating: 5, date: '2026-07-05', title: 'Perfect family resort', text: 'Kids club is excellent, the private beach is spotless and the breakfast spread is enormous. Great value.' },
  { id: 'r9', hotelId: 'hilton-london', author: 'Charlotte B.', avatar: null, rating: 4, date: '2026-06-28', title: 'Classic Mayfair stay', text: 'Location is unbeatable for Hyde Park and shopping. Rooms are a little compact but impeccably kept.' },
  { id: 'r10', hotelId: 'paris-central', author: 'Luc D.', avatar: null, rating: 4, date: '2026-06-19', title: 'Charming boutique', text: 'Rooftop breakfast with views of the Opéra district — magical. Rooms are small by US standards, but so is Paris.' },
  { id: 'r11', hotelId: 'swiss-alpine', author: 'Hannah K.', avatar: null, rating: 5, date: '2026-07-16', title: 'Alpine perfection', text: 'Waking up to the Eiger from our balcony. The heated pool after a day of hiking is pure bliss.' },
  { id: 'r12', hotelId: 'kerala-backwaters', author: 'Suresh P.', avatar: null, rating: 5, date: '2026-07-11', title: 'Backwater paradise', text: 'The houseboat-style villa, the Ayurvedic massage and the sunset cruise — this is what Kerala is about.' },
]

export const getReviews = (hotelId) => REVIEWS.filter((r) => r.hotelId === hotelId)
