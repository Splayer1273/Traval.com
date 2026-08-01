/**
 * Airlines — generic placeholders. No copyrighted logos are used;
 * each airline gets a colored monogram badge rendered in the UI.
 */
export const AIRLINES = [
  { id: 'airindia', name: 'Air India', code: 'AI', color: '#e11d48', alliance: 'Star Alliance', rating: 4.2 },
  { id: 'indigo', name: 'IndiGo', code: '6E', color: '#1d4ed8', alliance: '—', rating: 4.1 },
  { id: 'vistara', name: 'Vistara', code: 'UK', color: '#7c3aed', alliance: 'Star Alliance', rating: 4.4 },
  { id: 'emirates', name: 'Emirates', code: 'EK', color: '#b91c1c', alliance: '—', rating: 4.6 },
  { id: 'qatar', name: 'Qatar Airways', code: 'QR', color: '#7f1d1d', alliance: 'oneworld', rating: 4.7 },
  { id: 'singapore', name: 'Singapore Airlines', code: 'SQ', color: '#b45309', alliance: 'Star Alliance', rating: 4.8 },
  { id: 'lufthansa', name: 'Lufthansa', code: 'LH', color: '#1e3a8a', alliance: 'Star Alliance', rating: 4.3 },
  { id: 'british', name: 'British Airways', code: 'BA', color: '#164e63', alliance: 'oneworld', rating: 4.2 },
  { id: 'airasia', name: 'AirAsia', code: 'AK', color: '#a21caf', alliance: '—', rating: 3.9 },
  { id: 'goair', name: 'Go First', code: 'G8', color: '#15803d', alliance: '—', rating: 3.7 },
  { id: 'spicejet', name: 'SpiceJet', code: 'SG', color: '#b91c1c', alliance: '—', rating: 3.8 },
  { id: 'airfrance', name: 'Air France', code: 'AF', color: '#334155', alliance: 'SkyTeam', rating: 4.3 },
  { id: 'thai', name: 'Thai Airways', code: 'TG', color: '#7f1d1d', alliance: 'Star Alliance', rating: 4.1 },
]

export const getAirline = (id) => AIRLINES.find((a) => a.id === id) ?? AIRLINES[0]
