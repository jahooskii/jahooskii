import { Client, Booking, Vehicle, Driver, RevenueDay } from '@/types'

export const clients: Client[] = [
  {
    id: 'CL-101',
    name: 'Tunde Adeyemi',
    email: 'tunde@company.ng',
    phone: '+2348012345678',
    status: 'vip',
    activeBookings: 3,
    lifetimeValue: 2450000,
    itineraryDate: '2026-02-28',
    itineraryLocation: 'Presidential Hotel, Abuja'
  },
  {
    id: 'CL-102',
    name: 'Zainab Hassan',
    email: 'zainab@corp.ng',
    phone: '+2349876543210',
    status: 'corporate',
    activeBookings: 1,
    lifetimeValue: 1680000
  },
  {
    id: 'CL-103',
    name: 'Chidi Okonkwo',
    email: 'chidi@startups.ng',
    phone: '+2347050505050',
    status: 'standard',
    activeBookings: 0,
    lifetimeValue: 450000
  }
]

export const bookings: Booking[] = [
  {
    id: 'BK-201',
    pickup: 'VI, Lagos',
    destination: 'Abuja (Flight)',
    date: '2026-02-25',
    chauffeur: 'Daniel Perez',
    status: 'confirmed',
    price: 210000,
    barcodeId: 'QX-BK-201'
  },
  {
    id: 'BK-202',
    pickup: 'Lekki',
    destination: 'Ikoyi Business District',
    date: '2026-02-20',
    chauffeur: 'Maya Adeyemi',
    status: 'in-progress',
    price: 45000,
    barcodeId: 'QX-BK-202'
  },
  {
    id: 'BK-203',
    pickup: 'Ikeja',
    destination: 'Island Leisure Mall',
    date: '2026-02-18',
    chauffeur: 'Marcus Chen',
    status: 'completed',
    price: 52000,
    barcodeId: 'QX-BK-203'
  }
]

export const vehicles: Vehicle[] = [
  {
    id: 'VH-301',
    model: 'Mercedes-Benz S-Class',
    plate: 'LSD-123-XY',
    category: 'luxury',
    status: 'available',
    location: 'Victoria Island, Lagos',
    lat: 6.4281,
    lng: 3.4653
  },
  {
    id: 'VH-302',
    model: 'BMW 7 Series',
    plate: 'LSD-456-AB',
    category: 'sedan',
    status: 'booked',
    location: 'Ikoyi, Lagos',
    lat: 6.4512,
    lng: 3.4807
  },
  {
    id: 'VH-303',
    model: 'Range Rover Vogue',
    plate: 'LSD-789-CD',
    category: 'suv',
    status: 'maintenance',
    location: 'Lekki, Lagos',
    lat: 6.4969,
    lng: 3.5753
  },
  {
    id: 'VH-901',
    model: 'Gulfstream G650',
    plate: 'QX-JET-01',
    tailNumber: '5N-QLA',
    category: 'jet',
    status: 'available',
    location: 'Murtala Muhammed Intl, Lagos',
    lat: 6.5774,
    lng: 3.3212,
    pilotName: 'Captain Ibrahim Salisu',
    pilotContact: '+2348091122334'
  }
]

export const drivers: Driver[] = [
  {
    id: 'DR-401',
    name: 'Daniel Perez',
    rating: 4.9,
    status: 'on-trip',
    tripsThisMonth: 24
  },
  {
    id: 'DR-402',
    name: 'Maya Adeyemi',
    rating: 4.7,
    status: 'available',
    tripsThisMonth: 18
  },
  {
    id: 'DR-403',
    name: 'Marcus Chen',
    rating: 4.8,
    status: 'off-duty',
    tripsThisMonth: 21
  }
]

export const revenue: RevenueDay[] = [
  { id: 'REV-001', day: 'Monday', date: '2026-02-16', revenue: 580000 },
  { id: 'REV-002', day: 'Tuesday', date: '2026-02-17', revenue: 620000 },
  { id: 'REV-003', day: 'Wednesday', date: '2026-02-18', revenue: 710000 },
  { id: 'REV-004', day: 'Thursday', date: '2026-02-19', revenue: 840000 },
  { id: 'REV-005', day: 'Friday', date: '2026-02-20', revenue: 780000 },
  { id: 'REV-006', day: 'Saturday', date: '2026-02-21', revenue: 690000 },
  { id: 'REV-007', day: 'Sunday', date: '2026-02-22', revenue: 520000 }
]
