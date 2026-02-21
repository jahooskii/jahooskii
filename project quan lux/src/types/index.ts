export type Role = 'ceo' | 'dispatcher' | 'driver' | 'rider'

export type PageKey =
  | 'dashboard'
  | 'fleet'
  | 'bookings'
  | 'finance'
  | 'clients'
  | 'drivers'
  | 'rider'
  | 'dispatcher'
  | 'driver-console'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'vip' | 'corporate' | 'standard'
  activeBookings: number
  lifetimeValue: number
  itineraryDate?: string
  itineraryLocation?: string
}

export interface Booking {
  id: string
  clientId?: string
  pickup: string
  destination: string
  date: string
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  chauffeur: string
  price: number
  barcodeId?: string
}

export interface Vehicle {
  id: string
  model: string
  category: 'sedan' | 'suv' | 'luxury' | 'jet'
  plate: string
  tailNumber?: string
  status: 'available' | 'booked' | 'maintenance'
  location: string
  lat: number
  lng: number
  pilotName?: string
  pilotContact?: string
}

export interface Driver {
  id: string
  name: string
  rating: number
  status: 'available' | 'on-trip' | 'off-duty'
  tripsThisMonth: number
}

export interface RevenueDay {
  id: string
  day: string
  date: string
  revenue: number
}
