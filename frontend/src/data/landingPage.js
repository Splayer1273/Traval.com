import {
  Plane, Hotel, Car, Shield, FileCheck, Users, Handshake, Crown,
  ClipboardList, Wallet, MapPin, Clock, BarChart3, Settings, Smartphone,
  Globe, Headphones, Award, TrendingUp, BadgeCheck, Zap, Target,
  CheckCircle2, Building2, Briefcase, CalendarDays, Map, CreditCard,
  PieChart, Route, Luggage, Receipt, Search, ThumbsUp, ArrowRight,
} from 'lucide-react'

export const CHALLENGES = [
  { icon: Search, title: 'Scattered Bookings', text: 'Manage flights, hotels and transportation through a centralized travel platform.' },
  { icon: ClipboardList, title: 'Complex Approvals', text: 'Create structured approval workflows for employee travel.' },
  { icon: Wallet, title: 'Uncontrolled Spending', text: 'Set travel policies and budgets to improve control over corporate travel costs.' },
  { icon: Receipt, title: 'Manual Expense Processes', text: 'Simplify receipt collection, expense submission and approval.' },
  { icon: BarChart3, title: 'Limited Visibility', text: 'Give businesses better visibility into trips, expenses and travel activity.' },
  { icon: Headphones, title: 'Travel Disruptions', text: 'Provide professional assistance and support when plans change.' },
]

export const SOLUTION_STEPS = [
  { icon: Plane, label: 'Book', description: 'Flights, hotels and transportation.' },
  { icon: Settings, label: 'Control', description: 'Travel policies, budgets and approval workflows.' },
  { icon: Map, label: 'Travel', description: 'Manage itineraries and receive travel assistance.' },
  { icon: Receipt, label: 'Expense', description: 'Submit, review and manage travel expenses.' },
  { icon: PieChart, label: 'Analyze', description: 'Monitor travel spending and generate reports.' },
]

export const TRUST_STATS = [
  { value: '45+', label: 'Travel Industry Experience' },
  { value: '300+', label: 'Akbar Travels Offices Worldwide' },
  { value: '100+', label: 'Countries Visa Assistance' },
  { value: '24/7', label: 'Corporate Travel Support' },
]

export const SERVICES = [
  {
    id: 'flights', icon: Plane, title: 'Fly With Confidence',
    description: 'Arrange domestic and international business flights with professional booking assistance and travel support.',
    items: ['Domestic flights', 'International flights', 'Economy travel', 'Business class', 'Flexible fares', 'Seat selection', 'Baggage options', 'Corporate travel assistance'],
    cta: 'Explore Flight Services', link: '/flights',
  },
  {
    id: 'accommodation', icon: Hotel, title: 'Stay Where Business Takes You',
    description: 'Find corporate accommodation that matches company policies, budgets and traveler requirements.',
    items: ['Corporate hotel rates', 'Business hotels', 'Luxury properties', 'Serviced apartments', 'Executive stays', 'Early check-in', 'Late check-out', 'Meeting facilities', 'Workspaces', 'Consolidated billing'],
    cta: 'Explore Accommodation', link: '/hotels',
  },
  {
    id: 'transfers', icon: Car, title: 'Move Efficiently Between Every Destination',
    description: 'Arrange reliable ground transportation for business travelers, executives and corporate groups.',
    items: ['Airport transfers', 'Executive transfers', 'Business transportation', 'Group transportation'],
    cta: 'Explore Transfers', link: '/hotels',
  },
  {
    id: 'insurance', icon: Shield, title: 'Protection Beyond the Journey',
    description: 'Travel insurance solutions help protect business travelers against unexpected situations during their trips.',
    items: ['Medical emergencies', 'Emergency assistance', 'Trip cancellation', 'Travel delays', 'Lost baggage', 'Personal belongings', 'Personal accident', 'Third-party liability'],
    cta: 'Explore Insurance', link: '/extras/insurance',
  },
  {
    id: 'visa', icon: FileCheck, title: 'Visa Assistance Without the Hassle',
    description: 'Get professional support throughout the business and travel visa process.',
    items: ['Business visas', 'Tourist visas', 'Long-term visas', 'Work visas', 'Group visa processing', 'Documentation assistance', 'Appointment assistance', 'Application support'],
    extra: { label: 'Visa destinations', value: 'UAE · Schengen · USA · UK · Canada · Australia · Asia · Africa · Middle East' },
    badge: '100+ countries', cta: 'Explore Visa Services', link: '/extras/visa',
  },
  {
    id: 'mice', icon: Users, title: 'Meet. Connect. Experience.',
    description: 'Plan and manage corporate meetings, incentive trips, conferences and exhibitions with coordinated travel and event support.',
    items: ['Corporate meetings', 'Incentive travel', 'Conferences', 'Seminars', 'Exhibitions', 'Trade shows', 'Group travel', 'Hotel arrangements', 'Event logistics', 'On-site support'],
    cta: 'Explore MICE', link: '/contact',
  },
  {
    id: 'meet-greet', icon: Handshake, title: 'A Better Arrival Starts at the Airport',
    description: 'Professional airport assistance for executives, VIP travelers and corporate groups.',
    items: ['Airport welcome', 'Name-board assistance', 'Fast-track immigration', 'Security assistance', 'Baggage assistance', 'Porter services', 'Airport buggy', 'Airport navigation', 'VIP assistance', 'Group coordination'],
    cta: 'Explore Meet & Greet', link: '/contact',
  },
  {
    id: 'vip-charter', icon: Crown, title: 'Travel Without Limits',
    description: 'Premium private charter solutions for executives, corporate groups and specialized business travel requirements.',
    items: [], cta: 'Explore VIP Charter', link: '/contact',
  },
]

export const PLATFORM_FEATURES = [
  { icon: Search, title: 'Smart Booking', text: 'Search and book flights, accommodation and transportation from one platform.' },
  { icon: Shield, title: 'Travel Policy Management', text: 'Create company-specific travel policies, spending limits and booking rules.' },
  { icon: CheckCircle2, title: 'Automated Approvals', text: 'Route travel and expense requests to the appropriate managers for approval.' },
  { icon: Receipt, title: 'Expense Management', text: 'Submit receipts, track expenses and simplify review and reimbursement.' },
  { icon: BarChart3, title: 'Travel Dashboard', text: 'Monitor trips, approvals and expenses through centralized information.' },
  { icon: PieChart, title: 'Reporting & Analytics', text: 'Understand travel activity and spending with useful reports and analytics.' },
  { icon: Settings, title: 'Business Integrations', text: 'Connect travel processes with existing ERP, HRMS and accounting systems.' },
  { icon: Smartphone, title: 'Mobile Access', text: 'Access travel information and manage business travel while on the move.' },
]

export const HOW_IT_WORKS = [
  { step: '01', title: 'Search', text: 'Employees search for flights, hotels and transportation based on their requirements.' },
  { step: '02', title: 'Select', text: 'Travel options are selected according to company policies, budgets and preferences.' },
  { step: '03', title: 'Approve', text: 'Requests move through the company\'s configured approval workflow.' },
  { step: '04', title: 'Travel', text: 'Employees receive their booking and itinerary information and can manage their journey.' },
  { step: '05', title: 'Submit', text: 'Travelers upload receipts and submit their business expenses.' },
  { step: '06', title: 'Review', text: 'Managers and finance teams review and approve eligible expenses.' },
  { step: '07', title: 'Analyze', text: 'Businesses monitor travel activity, spending and reports through the platform.' },
]

export const TEAM_SOLUTIONS = [
  { icon: Target, title: 'For Business Leaders', heading: 'See the Bigger Picture', benefits: ['Cost control', 'Budget management', 'Travel visibility', 'Policy enforcement', 'Traveler safety', 'Scalable travel management'] },
  { icon: Briefcase, title: 'For Travel Coordinators', heading: 'Make Every Trip Easier to Manage', benefits: ['Centralized bookings', 'Approval management', 'Itinerary management', 'Traveler information', 'Policy management', 'Travel support'] },
  { icon: CreditCard, title: 'For Finance Teams', heading: 'Turn Travel Spending Into Clear Information', benefits: ['Expense tracking', 'Invoice management', 'Budget monitoring', 'Reporting', 'Reconciliation', 'Spending visibility'] },
  { icon: Users, title: 'For Employees', heading: 'Travel Without the Extra Hassle', benefits: ['Easy booking', 'Policy-compliant options', 'Trip management', 'Mobile access', 'Expense submission', 'Travel assistance'] },
]

export const GLOBAL_STATS = [
  { value: '300+', label: 'Worldwide Offices' },
  { value: '100+', label: 'Visa Destinations' },
  { value: '45+', label: 'Years of Experience' },
  { value: '24/7', label: 'Travel Assistance' },
]

export const WHY_CHOOSE = [
  { icon: Award, title: '45+ Years of Expertise', text: 'Decades of travel industry experience supporting the needs of business travelers.' },
  { icon: Globe, title: 'End-to-End Services', text: 'Manage flights, accommodation, transportation, visas, insurance, MICE and airport services through one partner.' },
  { icon: TrendingUp, title: 'Better Cost Management', text: 'Use corporate rates, travel policies and spending visibility to help control travel costs.' },
  { icon: Zap, title: 'Technology-Driven Management', text: 'Simplify bookings, approvals, expenses and reporting through a centralized digital platform.' },
  { icon: Headphones, title: 'Professional Support', text: 'Get assistance with travel changes, cancellations, disruptions and other business travel requirements.' },
  { icon: Globe, title: 'Global Network', text: 'Access international travel services backed by the Akbar network.' },
  { icon: BadgeCheck, title: 'Business-Focused Solutions', text: 'Travel solutions designed around organizational requirements, policies and business needs.' },
]

export const TESTIMONIALS = [
  { quote: 'Booked a few last-minute trips through Akbar Bizvoy and it worked perfectly. The process is simple, everything\'s organized, and I don\'t have to keep calling agents anymore. It\'s become my go-to for all office travel.', name: 'Chetan', role: 'Business Traveler' },
  { quote: 'We switched from managing travel through emails and spreadsheets to Akbar Bizvoy. The approval workflow and expense tracking alone saved our admin team hours every week. It\'s a proper corporate travel tool.', name: 'Bhaskar', role: 'Operations Manager' },
]

export const LANDING_FAQS = [
  { q: 'What services does Akbar Bizvoy provide?', a: 'Akbar Bizvoy provides corporate travel services including flights, accommodation, car transfers, travel insurance, visa assistance, MICE, Meet & Greet and VIP charter services.' },
  { q: 'Can businesses create their own travel policies?', a: 'Yes. Businesses can configure travel rules, spending limits, permissions and approval workflows according to their requirements.' },
  { q: 'Can Akbar Bizvoy integrate with existing systems?', a: 'Yes. The platform supports integration with ERP, HRMS and accounting systems.' },
  { q: 'Can small businesses use Akbar Bizvoy?', a: 'Yes. Corporate travel solutions are designed to support businesses of different sizes.' },
  { q: 'Is support available 24/7?', a: 'Yes. Corporate travelers can access 24/7 travel support.' },
  { q: 'Can employees make their own bookings?', a: 'Yes. Employees can search, select and manage business travel while following company-defined policies.' },
  { q: 'Can employees submit expenses?', a: 'Yes. Employees can submit expenses and receipts for review and approval.' },
  { q: 'Does Akbar Bizvoy offer mobile access?', a: 'Yes. Akbar Bizvoy provides mobile access for business travelers.' },
]
