import { Building2, ClipboardList, Wallet, Users, TrendingUp, CheckCircle2, BarChart3, Globe, Shield, Zap } from 'lucide-react'

export const SOLUTIONS_HERO = {
  badge: 'Role-Based Solutions',
  title: 'Travel Solutions Designed Around Your Business',
  subtitle: 'Every organization manages travel differently.',
  description: 'A CEO needs visibility. A travel coordinator needs control. Finance needs accurate numbers. Employees need simplicity. Akbar Bizvoy connects all of them through one corporate travel ecosystem.',
}

export const ROLE_SOLUTIONS = [
  {
    id: 'business-leaders',
    icon: TrendingUp,
    badge: 'Leadership',
    image: 'executiveOffice',
    title: 'See the Bigger Picture',
    description: 'Give leadership the visibility required to understand how business travel affects the organization.',
    benefits: [
      'Travel-spend visibility', 'Budget monitoring', 'Travel analytics',
      'Policy oversight', 'Approval visibility', 'Traveler information',
      'Cost optimization', 'Business reporting', 'Travel-risk awareness',
    ],
    dashboard: [
      'Total Travel Spend', 'Trips & Travelers', 'Departments',
      'Destinations', 'Travel Trends', 'Optimization Opportunities',
    ],
  },
  {
    id: 'travel-coordinators',
    icon: ClipboardList,
    badge: 'Coordination',
    image: 'travelDesk',
    title: 'Manage Every Journey With Greater Control',
    description: 'Travel coordinators often manage multiple employees, destinations, booking changes and approvals simultaneously. Akbar Bizvoy brings these activities into one connected workflow.',
    benefits: [
      'Employee profiles', 'Centralized bookings', 'Multi-traveler management',
      'Approval workflows', 'Itinerary management', 'Travel-policy enforcement',
      'Booking modifications', 'Disruption support', 'Traveler tracking', '24/7 assistance',
    ],
    highlight: 'Less manual coordination. More control over every journey.',
  },
  {
    id: 'finance-teams',
    icon: Wallet,
    badge: 'Finance',
    image: 'analyticsDash',
    title: 'Turn Travel Spending Into Useful Business Data',
    description: 'Corporate travel can become difficult to manage when bookings, invoices and expenses are scattered across different systems. Akbar Bizvoy helps finance teams bring travel information together.',
    benefits: [
      'Department spending', 'Employee spending', 'Travel categories',
      'Budgets', 'Invoices', 'Expenses', 'Reimbursements',
      'Policy compliance', 'Historical spending',
    ],
    highlight: 'Better visibility → Better control → Better financial decisions',
  },
  {
    id: 'employees',
    icon: Users,
    badge: 'Employees',
    image: 'businessLaptop',
    title: 'Business Travel Without the Administrative Headache',
    description: 'Employees should spend their time preparing for meetings, serving customers and growing the business — not struggling with travel arrangements.',
    benefits: [
      'Search flights', 'Book accommodation', 'Arrange transportation',
      'View itineraries', 'Manage travel preferences', 'Receive travel updates',
      'Request changes', 'Submit expenses', 'Access support',
    ],
    workflow: ['Search', 'Book', 'Approve', 'Travel', 'Expense', 'Complete'],
  },
]

export const ENTERPRISE_FLOW = {
  title: 'One Connected Travel Ecosystem',
  description: 'Akbar Bizvoy connects the entire organization. Everyone works with connected travel information rather than isolated booking and expense processes.',
  steps: ['Employee', 'Travel Coordinator', 'Manager / Approver', 'Finance', 'Business Leadership'],
}
