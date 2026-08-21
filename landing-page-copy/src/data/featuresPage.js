import { Search, Shield, CheckCircle2, Receipt, BarChart3, Settings, Smartphone, Clock, Users, FileText, Link, Headphones } from 'lucide-react'

export const FEATURES_HERO = {
  badge: 'Platform',
  title: 'Technology That Makes Corporate Travel Easier',
  subtitle: 'Modern business travel requires more than a booking engine.',
  description: 'It requires visibility, automation, policy control, expense management and reliable support. Akbar Bizvoy brings these capabilities together in one corporate travel ecosystem.',
}

export const FEATURE_SECTIONS = [
  {
    id: 'centralized',
    icon: Search,
    title: 'Centralized Travel Management',
    image: 'corporateTeam',
    subtitle: 'One Place. Every Journey.',
    description: 'Bring essential corporate travel activities together in one connected environment.',
    capabilities: [
      'Flights', 'Hotels', 'Transportation', 'Travelers', 'Itineraries',
      'Approvals', 'Expenses', 'Invoices', 'Reports',
    ],
  },
  {
    id: 'approvals',
    icon: CheckCircle2,
    title: 'Approval Automation',
    image: 'businessMeeting',
    subtitle: 'No More Endless Approval Emails',
    description: 'Create structured approval workflows that make corporate travel easier to control.',
    workflow: [
      'Employee travel requests', 'Manager approval', 'Policy verification',
      'Booking confirmation', 'Traveler notifications',
    ],
  },
  {
    id: 'policy',
    icon: Shield,
    title: 'Travel Policy Management',
    image: 'executiveOffice',
    subtitle: 'Give Employees Freedom Within Clear Boundaries',
    description: 'Keep employee travel aligned with company policies, budgets and organizational requirements.',
    capabilities: [
      'Airfare policies', 'Hotel budgets', 'Traveler categories',
      'Approval levels', 'Department rules', 'Spending limits',
    ],
    result: 'More compliant bookings + better cost control',
  },
  {
    id: 'expenses',
    icon: Receipt,
    title: 'Expense Management',
    image: 'expenseReport',
    subtitle: 'Make Every Travel Expense Easier to Track',
    description: 'Make business travel expenses easier to submit, review and track.',
    capabilities: [
      'Expense submission', 'Receipt uploads', 'Expense categorization',
      'Approval workflow', 'Reimbursement support', 'Expense reporting',
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    title: 'Travel Analytics',
    image: 'analyticsDash',
    subtitle: 'Data That Helps You Travel Smarter',
    description: 'Turn corporate travel data into useful insights for better business decisions.',
    capabilities: [
      'Total travel spending', 'Department spending', 'Employee spending',
      'Destination trends', 'Booking patterns', 'Travel frequency',
      'Policy compliance',
    ],
  },
  {
    id: 'realtime',
    icon: Clock,
    title: 'Real-Time Travel Information',
    image: 'businessFlight',
    subtitle: 'Stay Informed When Plans Change',
    description: 'Keep travelers and travel managers informed when travel plans change.',
    capabilities: [
      'Flight delays', 'Flight cancellations', 'Schedule changes',
      'Booking updates', 'Itinerary changes', 'Travel disruption alerts',
    ],
  },
  {
    id: 'profiles',
    icon: Users,
    title: 'Traveler Profiles',
    image: 'travelPassport',
    subtitle: 'Travel That Remembers Preferences',
    description: 'Centralize traveler information and preferences to simplify future business journeys.',
    capabilities: [
      'Traveler information', 'Airline preferences', 'Seat preferences',
      'Meal preferences', 'Passport information', 'Corporate travel preferences',
    ],
  },
  {
    id: 'reporting',
    icon: FileText,
    title: 'Reporting & Invoicing',
    image: 'businessCard',
    subtitle: 'Turn Travel Activity Into Business Reports',
    description: 'Give finance and management teams better visibility into corporate travel activity.',
    capabilities: [
      'Booking reports', 'Travel expense reports', 'Department reports',
      'Employee travel reports', 'Destination reports', 'Invoice management',
      'Policy compliance reports',
    ],
  },
  {
    id: 'integrations',
    icon: Link,
    title: 'Integrations',
    image: 'globeNetwork',
    subtitle: 'Connect Travel With Your Existing Business Systems',
    description: 'Akbar Bizvoy can integrate with business platforms such as HRMS, ERP, accounting systems and internal corporate systems to reduce duplicate work and create a smoother flow of information.',
    capabilities: ['HRMS', 'ERP', 'Accounting systems', 'Internal corporate systems'],
  },
  {
    id: 'support',
    icon: Headphones,
    title: '24/7 Travel Assistance',
    image: 'conferenceRoom',
    subtitle: 'Technology When You Need Speed. People When You Need Help.',
    description: 'Combine technology with professional travel support whenever your business needs it.',
    capabilities: [
      'Booking assistance', 'Travel changes', 'Cancellations',
      'Travel disruptions', 'Emergency requirements', 'General travel support',
    ],
  },
]
