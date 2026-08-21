/**
 * Airports used for flight routes.
 */
export const AIRPORTS = [
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl', country: 'India', terminal: 'T2' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International', country: 'India', terminal: 'T3' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International', country: 'India', terminal: 'T2' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'India', terminal: 'T1' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl', country: 'India', terminal: 'T1' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'India', terminal: 'T1' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE', terminal: 'T3' },
  { code: 'SIN', city: 'Singapore', name: 'Changi International', country: 'Singapore', terminal: 'T1' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom', terminal: 'T5' },
  { code: 'JFK', city: 'New York', name: 'John F Kennedy International', country: 'USA', terminal: 'T4' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', terminal: 'T2E' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand', terminal: 'T1' },
  { code: 'ZRH', city: 'Zurich', name: 'Zurich Airport', country: 'Switzerland', terminal: 'T1' },
  { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam Intl', country: 'India', terminal: 'T1' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh Airport', country: 'India', terminal: 'T1' },
  { code: 'GOI', city: 'Goa', name: 'Dabolim Airport', country: 'India', terminal: 'T1' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International', country: 'India', terminal: 'T3' },
  { code: 'HKT', city: 'Phuket', name: 'Phuket International', country: 'Thailand', terminal: 'T2' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International', country: 'Japan', terminal: 'T1' },
  { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci–Fiumicino', country: 'Italy', terminal: 'T3' },
]

export const getAirport = (code) => AIRPORTS.find((a) => a.code === code)
