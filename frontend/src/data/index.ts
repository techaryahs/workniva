import type { UseCase, Facility, PricingPlan, FaqItem } from '../types';

export const useCases: UseCase[] = [
  { title: 'Client Meetings', description: 'Impress clients in a premium environment.', icon: 'Users' },
  { title: 'Interviews', description: 'Conduct interviews in a professional setting.', icon: 'Briefcase' },
  { title: 'Brainstorming', description: 'Whiteboards and space to think.', icon: 'Lightbulb' },
  { title: 'Quiet Work', description: 'Escape the noise and focus.', icon: 'Headphones' },
  { title: 'Workshops', description: 'Host small group workshops.', icon: 'Presentation' },
  { title: 'Podcasting', description: 'Quiet rooms with good acoustics.', icon: 'Mic' },
  { title: 'Freelancer Base', description: 'Your office away from home.', icon: 'Laptop' },
  { title: 'Startup Hub', description: 'A base for your growing team.', icon: 'Rocket' },
];

export const facilities: Facility[] = [
  { title: 'High-Speed Wi-Fi', description: 'Enterprise-grade internet connectivity.', icon: 'Wifi' },
  { title: 'Smart TV & AV', description: 'For seamless presentations.', icon: 'Tv' },
  { title: 'Whiteboards', description: 'Capture your big ideas.', icon: 'PenTool' },
  { title: 'Premium Coffee', description: 'Keep the energy high.', icon: 'Coffee' },
  { title: 'Ergonomic Chairs', description: 'Work comfortably for hours.', icon: 'Armchair' },
  { title: 'Printing & Scanning', description: 'Business center amenities.', icon: 'Printer' },
  { title: 'Secure Access', description: '24/7 smart lock entry.', icon: 'Lock' },
  { title: 'Climate Control', description: 'Adjustable AC and heating.', icon: 'Thermometer' },
];

export const pricingPlans: PricingPlan[] = [
  { title: '1 Hour', price: '$25', period: '/hour', features: ['All amenities', 'Up to 4 guests', 'Free cancellation'] },
  { title: 'Half Day', price: '$80', period: '/4 hours', features: ['All amenities', 'Up to 4 guests', 'Priority support'], isPopular: true },
  { title: 'Full Day', price: '$140', period: '/8 hours', features: ['All amenities', 'Up to 4 guests', 'Dedicated assistant'] },
];

export const faqs: FaqItem[] = [
  { question: 'How do I access the office?', answer: 'You will receive a smart lock code 15 minutes before your booking starts.' },
  { question: 'Can I cancel my booking?', answer: 'Cancellations made 24 hours in advance are fully refunded.' },
  { question: 'Are there hidden fees?', answer: 'No, the price you see is the price you pay. All amenities are included.' },
  { question: 'Can I bring guests?', answer: 'Yes, our standard offices accommodate up to 4 people.' },
];

export * from './contact';
