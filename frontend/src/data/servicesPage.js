import { Plane, Hotel, Car, Shield, FileCheck, Users, Handshake, Crown, CheckCircle2 } from 'lucide-react'

export const SERVICES_HERO = {
  badge: 'Complete Solutions',
  title: 'Complete Corporate Travel Services, All in One Place',
  subtitle: 'Business travel involves more than booking a ticket. It requires coordination, flexibility, cost control, reliable transportation, documentation and support throughout the journey.',
  description: 'Akbar Bizvoy brings every essential corporate travel service together, helping organizations manage business journeys from departure to return through one trusted travel partner.',
  cta1: 'Explore Services',
  cta2: 'Talk to a Travel Expert',
}

export const SERVICES_OVERVIEW = {
  title: 'Everything Your Business Needs to Travel Better',
  description: 'From a single executive journey to large-scale corporate travel programs, Akbar Bizvoy provides solutions designed around the requirements of modern organizations.',
  items: [
    { icon: Plane, label: 'Air Travel', text: 'Corporate flight booking and itinerary management.' },
    { icon: Hotel, label: 'Accommodation', text: 'Business hotels, premium properties and corporate stays.' },
    { icon: Car, label: 'Ground Transportation', text: 'Airport transfers, chauffeur services and corporate mobility.' },
    { icon: Shield, label: 'Travel Protection', text: 'Travel insurance and emergency assistance.' },
    { icon: FileCheck, label: 'Visa Support', text: 'Professional assistance with business and international visa requirements.' },
    { icon: Users, label: 'MICE', text: 'Meetings, incentives, conferences and exhibitions.' },
    { icon: Handshake, label: 'Airport Assistance', text: 'Meet & Greet services for executives and corporate travelers.' },
    { icon: Crown, label: 'VIP Charter', text: 'Private aircraft, helicopters and premium charter solutions.' },
  ],
}

export const SERVICE_SECTIONS = [
  {
    id: 'flights',
    icon: Plane,
    badge: 'Air Travel',
    image: 'businessFlight',
    title: 'Fly Smarter. Keep Your Business Moving.',
    description: 'Corporate travel schedules can change quickly. Akbar Bizvoy helps businesses manage air travel with flexible options and professional assistance.',
    capabilities: [
      'Domestic flights', 'International flights', 'One-way journeys', 'Round-trip journeys',
      'Multi-city itineraries', 'Business-class travel', 'Economy travel', 'Group bookings',
      'Corporate travel requirements', 'Seat preferences', 'Baggage requirements',
      'Booking changes', 'Cancellations and support',
    ],
    benefits: [
      { title: 'Better Flexibility', text: 'Manage changing business schedules more easily.' },
      { title: 'Corporate Control', text: 'Align bookings with company travel policies.' },
      { title: 'Centralized Management', text: 'Keep travel information and booking details organized.' },
      { title: 'Professional Assistance', text: 'Get support when plans change or unexpected travel issues occur.' },
    ],
  },
  {
    id: 'accommodation',
    icon: Hotel,
    badge: 'Accommodation',
    image: 'hotelReception',
    title: 'Stay Where Business Takes You',
    description: 'The right accommodation can make a business trip more productive and comfortable. Akbar Bizvoy helps companies arrange stays based on location, budget, travel policy and traveler preferences.',
    capabilities: [
      'Business hotels', 'Premium hotels', 'Luxury properties', 'Serviced apartments',
      'Executive stays', 'Long-stay accommodation', 'Group accommodation',
    ],
    considerations: [
      'Office location', 'Airport proximity', 'Conference venue', 'Client location',
      'Budget', 'Traveler preferences', 'Company policy',
    ],
    benefits: [
      { title: 'Centralized Booking', text: 'Manage all hotel bookings from one platform.' },
      { title: 'Corporate Rates', text: 'Access negotiated rates where available.' },
      { title: 'Flexible Management', text: 'Modify bookings as plans change.' },
      { title: 'Consolidated Billing', text: 'Simplified invoicing for finance teams.' },
    ],
  },
  {
    id: 'transfers',
    icon: Car,
    badge: 'Ground Transportation',
    image: 'vipTransfer',
    title: 'From Airport to Meeting Room, Without the Stress',
    description: 'Reliable ground transportation is an important part of business travel. Akbar Bizvoy coordinates transportation for executives, employees, clients and corporate groups.',
    capabilities: [
      'Airport pickup', 'Airport drop-off', 'Chauffeur services', 'Executive cars',
      'Point-to-point transfers', 'Hourly rentals', 'Daily rentals',
      'Group transportation', 'VIP transportation',
    ],
    workflow: 'Flight arrival → Airport pickup → Hotel → Office → Meeting → Airport',
    workflowText: 'Transportation can be coordinated around your full itinerary, helping travelers maintain a smoother journey while reducing unnecessary coordination.',
  },
  {
    id: 'insurance',
    icon: Shield,
    badge: 'Travel Protection',
    image: 'travelPassport',
    title: 'Protection for the Unexpected',
    description: 'Business travel can involve unexpected delays, cancellations, medical emergencies or baggage problems. Travel-insurance solutions can help businesses protect employees while they are traveling.',
    capabilities: [
      'Medical emergencies', 'Hospitalization', 'Emergency evacuation', 'Trip cancellation',
      'Trip delay', 'Lost baggage', 'Personal accident', 'Emergency assistance', 'Travel support',
    ],
    options: [
      'Single-trip policies', 'Multi-trip policies', 'Group coverage', 'Corporate plans',
    ],
  },
  {
    id: 'visa',
    icon: FileCheck,
    badge: 'Visa Services',
    image: 'businessCard',
    title: 'Your International Journey Starts With the Right Documentation',
    description: 'International business travel requires careful documentation and timely visa processing. Akbar Bizvoy assists corporate travelers throughout the visa process.',
    capabilities: [
      'Business visas', 'Work visas', 'Long-term visas',
      'Tourist visas for business/leisure travel', 'Group applications',
    ],
    assistance: [
      { title: 'Document Preparation', text: 'Help organize required documentation.' },
      { title: 'Application Assistance', text: 'Support travelers during application preparation.' },
      { title: 'Appointment Assistance', text: 'Help coordinate required appointments.' },
      { title: 'Submission Support', text: 'Assist with the submission process.' },
      { title: 'Corporate Applications', text: 'Support multiple employees and group applications.' },
    ],
    destinations: ['Middle East', 'Europe', 'North America', 'Asia', 'Africa', 'Australia'],
  },
  {
    id: 'mice',
    icon: Users,
    badge: 'MICE',
    image: 'conferenceRoom',
    title: 'Meet. Connect. Experience.',
    description: 'Corporate events require much more than a venue. Akbar Bizvoy supports the travel and logistical requirements behind meetings, incentives, conferences and exhibitions.',
    capabilities: [
      'Group travel', 'Hotel coordination', 'Venue support', 'Transportation',
      'Customized itineraries', 'Event coordination', 'On-ground assistance', 'Destination support',
    ],
    categories: [
      { title: 'Meetings', text: 'Executive meetings, leadership gatherings and corporate events.' },
      { title: 'Incentives', text: 'Reward and incentive travel designed for employees, partners and teams.' },
      { title: 'Conferences', text: 'Travel, accommodation and coordination for corporate conferences.' },
      { title: 'Exhibitions', text: 'Support for businesses participating in trade shows and exhibitions.' },
    ],
  },
  {
    id: 'meet-greet',
    icon: Handshake,
    badge: 'Airport Assistance',
    image: 'airportLounge',
    title: 'A Better Welcome Starts at the Airport',
    description: 'Give your executives, employees and visiting clients a smoother airport experience.',
    capabilities: [
      'Personalized airport welcome', 'Terminal assistance', 'Immigration assistance',
      'Security assistance', 'Porter service', 'Luggage assistance', 'Airport buggy',
      'Airport navigation', 'Boarding assistance', 'VIP coordination',
    ],
    idealFor: ['CEOs', 'Senior executives', 'VIP guests', 'International clients', 'Corporate delegations', 'Business groups'],
  },
  {
    id: 'vip-charter',
    icon: Crown,
    badge: 'VIP Charter',
    image: 'privateJet',
    title: 'Travel on Your Terms',
    description: 'For travelers who require privacy, flexibility and premium service, Akbar Bizvoy provides charter travel solutions.',
    capabilities: [
      { title: 'Private Jets', text: 'Premium aircraft for executive and corporate travel.' },
      { title: 'Helicopters', text: 'Convenient transportation for selected routes and destinations.' },
      { title: 'Group Charters', text: 'Solutions for corporate groups, conferences and events.' },
      { title: 'Emergency Charters', text: 'Support for emergency and medical travel requirements.' },
      { title: 'Concierge Services', text: 'Ground transportation, accommodation and additional premium arrangements.' },
    ],
  },
]

export const HOW_IT_WORKS_STEPS = [
  { step: '01', title: 'Plan', text: 'Understand the travel requirement, destination, traveler and company policy.' },
  { step: '02', title: 'Search', text: 'Find suitable flights, accommodation and transportation options.' },
  { step: '03', title: 'Approve', text: 'Route travel requests through the organization\'s approval workflow.' },
  { step: '04', title: 'Book', text: 'Confirm the approved travel arrangements.' },
  { step: '05', title: 'Travel', text: 'Provide itinerary information and assistance throughout the journey.' },
  { step: '06', title: 'Manage', text: 'Handle changes, disruptions, cancellations and additional requirements.' },
  { step: '07', title: 'Expense', text: 'Record and submit travel-related expenses.' },
  { step: '08', title: 'Analyze', text: 'Review travel spending, activity and trends to improve future decisions.' },
]
