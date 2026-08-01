/**
 * Flight inventory. Times are stored as minutes from midnight so the search
 * service can schedule them onto any searched date (including overnights).
 * Prices are INR.
 */
export const FLIGHT_ROUTES = [
  // Mumbai → Delhi
  { route: ['BOM', 'DEL'], airline: 'indigo', flightNumber: '6E-201', dep: 390, dur: 135, stops: 0, stopCity: null, price: 4299, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['BOM', 'DEL'], airline: 'vistara', flightNumber: 'UK-911', dep: 480, dur: 145, stops: 0, stopCity: null, price: 5499, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  { route: ['BOM', 'DEL'], airline: 'airindia', flightNumber: 'AI-864', dep: 960, dur: 150, stops: 0, stopCity: null, price: 6199, refundable: true, aircraft: 'A320', cabin: 'Economy' },
  { route: ['BOM', 'DEL'], airline: 'spicejet', flightNumber: 'SG-8163', dep: 1290, dur: 140, stops: 0, stopCity: null, price: 3899, refundable: false, aircraft: 'B737 MAX', cabin: 'Economy' },
  { route: ['BOM', 'DEL'], airline: 'airindia', flightNumber: 'AI-802', dep: 1410, dur: 150, stops: 0, stopCity: null, price: 7499, refundable: true, aircraft: 'B787-8', cabin: 'Economy' },
  { route: ['BOM', 'DEL'], airline: 'goair', flightNumber: 'G8-122', dep: 1860, dur: 150, stops: 0, stopCity: null, price: 3599, refundable: false, aircraft: 'A320', cabin: 'Economy' },
  // Delhi → Mumbai
  { route: ['DEL', 'BOM'], airline: 'indigo', flightNumber: '6E-515', dep: 420, dur: 135, stops: 0, stopCity: null, price: 4099, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['DEL', 'BOM'], airline: 'vistara', flightNumber: 'UK-983', dep: 840, dur: 145, stops: 0, stopCity: null, price: 5799, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  { route: ['DEL', 'BOM'], airline: 'airindia', flightNumber: 'AI-805', dep: 1080, dur: 150, stops: 0, stopCity: null, price: 6499, refundable: true, aircraft: 'A320', cabin: 'Economy' },
  { route: ['DEL', 'BOM'], airline: 'spicejet', flightNumber: 'SG-8153', dep: 1500, dur: 140, stops: 0, stopCity: null, price: 3799, refundable: false, aircraft: 'B737 MAX', cabin: 'Economy' },
  // Mumbai → Bengaluru
  { route: ['BOM', 'BLR'], airline: 'indigo', flightNumber: '6E-6111', dep: 330, dur: 100, stops: 0, stopCity: null, price: 3299, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['BOM', 'BLR'], airline: 'airasia', flightNumber: 'I5-1422', dep: 630, dur: 105, stops: 0, stopCity: null, price: 2999, refundable: false, aircraft: 'A320', cabin: 'Economy' },
  { route: ['BOM', 'BLR'], airline: 'airindia', flightNumber: 'AI-606', dep: 1005, dur: 110, stops: 0, stopCity: null, price: 4599, refundable: true, aircraft: 'A320', cabin: 'Economy' },
  { route: ['BOM', 'BLR'], airline: 'vistara', flightNumber: 'UK-831', dep: 1365, dur: 105, stops: 0, stopCity: null, price: 4999, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  // Delhi → Bengaluru
  { route: ['DEL', 'BLR'], airline: 'indigo', flightNumber: '6E-231', dep: 360, dur: 165, stops: 0, stopCity: null, price: 4699, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['DEL', 'BLR'], airline: 'airindia', flightNumber: 'AI-503', dep: 810, dur: 175, stops: 1, stopCity: 'BOM', price: 5599, refundable: true, aircraft: 'A320', cabin: 'Economy' },
  { route: ['DEL', 'BLR'], airline: 'vistara', flightNumber: 'UK-873', dep: 1170, dur: 170, stops: 0, stopCity: null, price: 6299, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  { route: ['DEL', 'BLR'], airline: 'spicejet', flightNumber: 'SG-8107', dep: 1470, dur: 170, stops: 0, stopCity: null, price: 4199, refundable: false, aircraft: 'B737', cabin: 'Economy' },
  // Mumbai → Dubai
  { route: ['BOM', 'DXB'], airline: 'emirates', flightNumber: 'EK-501', dep: 258, dur: 195, stops: 0, stopCity: null, price: 16999, refundable: true, aircraft: 'B777-300ER', cabin: 'Economy' },
  { route: ['BOM', 'DXB'], airline: 'airindia', flightNumber: 'AI-967', dep: 660, dur: 205, stops: 0, stopCity: null, price: 14999, refundable: true, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['BOM', 'DXB'], airline: 'indigo', flightNumber: '6E-71', dep: 1110, dur: 210, stops: 0, stopCity: null, price: 11999, refundable: false, aircraft: 'A321neo', cabin: 'Economy' },
  { route: ['BOM', 'DXB'], airline: 'goair', flightNumber: 'G8-1357', dep: 1470, dur: 230, stops: 0, stopCity: null, price: 10999, refundable: false, aircraft: 'A320', cabin: 'Economy' },
  // Delhi → Dubai
  { route: ['DEL', 'DXB'], airline: 'emirates', flightNumber: 'EK-513', dep: 300, dur: 220, stops: 0, stopCity: null, price: 17999, refundable: true, aircraft: 'B777-300ER', cabin: 'Economy' },
  { route: ['DEL', 'DXB'], airline: 'qatar', flightNumber: 'QR-577', dep: 750, dur: 265, stops: 1, stopCity: 'DOH', price: 15999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  { route: ['DEL', 'DXB'], airline: 'airindia', flightNumber: 'AI-995', dep: 1080, dur: 225, stops: 0, stopCity: null, price: 13999, refundable: true, aircraft: 'A320neo', cabin: 'Economy' },
  // Delhi → London
  { route: ['DEL', 'LHR'], airline: 'british', flightNumber: 'BA-142', dep: 480, dur: 565, stops: 0, stopCity: null, price: 48999, refundable: true, aircraft: 'B787-9', cabin: 'Economy' },
  { route: ['DEL', 'LHR'], airline: 'airindia', flightNumber: 'AI-111', dep: 750, dur: 575, stops: 0, stopCity: null, price: 45999, refundable: true, aircraft: 'B787-8', cabin: 'Economy' },
  { route: ['DEL', 'LHR'], airline: 'lufthansa', flightNumber: 'LH-763', dep: 1020, dur: 640, stops: 1, stopCity: 'FRA', price: 42999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  { route: ['DEL', 'LHR'], airline: 'emirates', flightNumber: 'EK-571', dep: 1330, dur: 690, stops: 1, stopCity: 'DXB', price: 47999, refundable: true, aircraft: 'A380-800', cabin: 'Economy' },
  // Mumbai → Singapore
  { route: ['BOM', 'SIN'], airline: 'singapore', flightNumber: 'SQ-423', dep: 345, dur: 340, stops: 0, stopCity: null, price: 19999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  { route: ['BOM', 'SIN'], airline: 'airindia', flightNumber: 'AI-343', dep: 780, dur: 350, stops: 0, stopCity: null, price: 17999, refundable: true, aircraft: 'B787-8', cabin: 'Economy' },
  { route: ['BOM', 'SIN'], airline: 'indigo', flightNumber: '6E-1001', dep: 1140, dur: 360, stops: 0, stopCity: null, price: 14999, refundable: false, aircraft: 'A321LR', cabin: 'Economy' },
  { route: ['BOM', 'SIN'], airline: 'airasia', flightNumber: 'AK-47', dep: 1470, dur: 375, stops: 0, stopCity: null, price: 13999, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  // Delhi → New York
  { route: ['DEL', 'JFK'], airline: 'airindia', flightNumber: 'AI-101', dep: 480, dur: 935, stops: 0, stopCity: null, price: 65999, refundable: true, aircraft: 'B777-300ER', cabin: 'Economy' },
  { route: ['DEL', 'JFK'], airline: 'british', flightNumber: 'BA-258', dep: 660, dur: 1035, stops: 1, stopCity: 'LHR', price: 61999, refundable: true, aircraft: 'B787-9', cabin: 'Economy' },
  { route: ['DEL', 'JFK'], airline: 'emirates', flightNumber: 'EK-597', dep: 900, dur: 1080, stops: 1, stopCity: 'DXB', price: 62999, refundable: true, aircraft: 'A380-800', cabin: 'Economy' },
  { route: ['DEL', 'JFK'], airline: 'lufthansa', flightNumber: 'LH-401', dep: 1230, dur: 1120, stops: 1, stopCity: 'FRA', price: 58999, refundable: true, aircraft: 'A350-1000', cabin: 'Economy' },
  // Delhi → Bangkok
  { route: ['DEL', 'BKK'], airline: 'thai', flightNumber: 'TG-324', dep: 390, dur: 265, stops: 0, stopCity: null, price: 12999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  { route: ['DEL', 'BKK'], airline: 'airindia', flightNumber: 'AI-330', dep: 840, dur: 275, stops: 0, stopCity: null, price: 11999, refundable: true, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['DEL', 'BKK'], airline: 'indigo', flightNumber: '6E-41', dep: 1260, dur: 280, stops: 0, stopCity: null, price: 9999, refundable: false, aircraft: 'A321neo', cabin: 'Economy' },
  // Mumbai → Goa
  { route: ['BOM', 'GOI'], airline: 'indigo', flightNumber: '6E-531', dep: 360, dur: 75, stops: 0, stopCity: null, price: 2999, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['BOM', 'GOI'], airline: 'goair', flightNumber: 'G8-178', dep: 780, dur: 80, stops: 0, stopCity: null, price: 2799, refundable: false, aircraft: 'A320', cabin: 'Economy' },
  { route: ['BOM', 'GOI'], airline: 'spicejet', flightNumber: 'SG-1109', dep: 1290, dur: 75, stops: 0, stopCity: null, price: 3199, refundable: false, aircraft: 'B737', cabin: 'Economy' },
  { route: ['BOM', 'GOI'], airline: 'vistara', flightNumber: 'UK-844', dep: 1560, dur: 80, stops: 0, stopCity: null, price: 3999, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  // Delhi → Srinagar
  { route: ['DEL', 'SXR'], airline: 'airindia', flightNumber: 'AI-461', dep: 420, dur: 95, stops: 0, stopCity: null, price: 6999, refundable: true, aircraft: 'A320', cabin: 'Economy' },
  { route: ['DEL', 'SXR'], airline: 'indigo', flightNumber: '6E-241', dep: 870, dur: 95, stops: 0, stopCity: null, price: 5999, refundable: false, aircraft: 'A320neo', cabin: 'Economy' },
  { route: ['DEL', 'SXR'], airline: 'vistara', flightNumber: 'UK-611', dep: 1320, dur: 100, stops: 0, stopCity: null, price: 7499, refundable: true, aircraft: 'A321neo', cabin: 'Economy' },
  // Mumbai → Paris
  { route: ['BOM', 'CDG'], airline: 'airfrance', flightNumber: 'AF-217', dep: 390, dur: 565, stops: 0, stopCity: null, price: 47999, refundable: true, aircraft: 'B777-300ER', cabin: 'Economy' },
  { route: ['BOM', 'CDG'], airline: 'qatar', flightNumber: 'QR-555', dep: 870, dur: 640, stops: 1, stopCity: 'DOH', price: 43999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  // Delhi → Zurich
  { route: ['DEL', 'ZRH'], airline: 'lufthansa', flightNumber: 'LH-769', dep: 540, dur: 640, stops: 1, stopCity: 'FRA', price: 45999, refundable: true, aircraft: 'A350-900', cabin: 'Economy' },
  { route: ['DEL', 'ZRH'], airline: 'emirates', flightNumber: 'EK-581', dep: 1020, dur: 700, stops: 1, stopCity: 'DXB', price: 48999, refundable: true, aircraft: 'A380-800', cabin: 'Economy' },
]

/** Cabin class price multipliers applied by the search service. */
export const CABIN_MULTIPLIER = {
  Economy: 1,
  'Premium Economy': 1.6,
  Business: 3.1,
  'First Class': 5.2,
}

export const POPULAR_ROUTES = [
  { from: 'BOM', to: 'DEL', label: 'Mumbai → Delhi' },
  { from: 'BOM', to: 'BLR', label: 'Mumbai → Bengaluru' },
  { from: 'BOM', to: 'DXB', label: 'Mumbai → Dubai' },
  { from: 'DEL', to: 'LHR', label: 'Delhi → London' },
  { from: 'BOM', to: 'SIN', label: 'Mumbai → Singapore' },
  { from: 'DEL', to: 'JFK', label: 'Delhi → New York' },
  { from: 'BOM', to: 'GOI', label: 'Mumbai → Goa' },
  { from: 'DEL', to: 'BKK', label: 'Delhi → Bangkok' },
]
