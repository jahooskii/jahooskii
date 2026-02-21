import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { PageKey, Role } from '@/types'
import { Dashboard } from '@/pages/Dashboard'
import { FleetManagement } from '@/pages/FleetManagement'
import { BookingManagement } from '@/pages/BookingManagement'
import { FinanceModule } from '@/pages/FinanceModule'
import { ClientCRM } from '@/pages/ClientCRM'
import { DriverManagement } from '@/pages/DriverManagement'
import { RiderPortal } from '@/pages/RiderPortal'
import { DispatcherConsole } from '@/pages/DispatcherConsole'
import { DriverConsole } from '@/pages/DriverConsole'
import { Toaster } from 'sonner'
import { IntroOverlay } from '@/components/intro/IntroOverlay'
import { useAuth } from '@/context/AuthContext'
import { AdminLogin } from '@/components/auth/AdminLogin'
import { ShieldCheck, UserCircle2 } from 'lucide-react'

const pageCopy: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Executive Overview',
    subtitle: 'Monitor live operations, revenue, and service performance.'
  },
  fleet: {
    title: 'Fleet Control',
    subtitle: 'Track vehicle readiness and availability in real time.'
  },
  bookings: {
    title: 'Booking Intelligence',
    subtitle: 'Oversee active itineraries and chauffeur assignments.'
  },
  finance: {
    title: 'Finance & Revenue',
    subtitle: 'Review weekly revenue, settlements, and key profitability metrics.'
  },
  clients: {
    title: 'Client Concierge',
    subtitle: 'Deliver white-glove service with lifetime value insights.'
  },
  drivers: {
    title: 'Driver Excellence',
    subtitle: 'Keep chauffeurs aligned with premium service standards.'
  },
  rider: {
    title: 'Rider Experience',
    subtitle: 'A premium rider view with live trip tracking and ETAs.'
  },
  dispatcher: {
    title: 'Dispatch Command',
    subtitle: 'Coordinate rides, drivers, and live vehicle locations.'
  },
  'driver-console': {
    title: 'Driver Console',
    subtitle: 'Personal trip board with route and rider details.'
  }
}

const pageComponents: Record<PageKey, JSX.Element> = {
  dashboard: <Dashboard />,
  fleet: <FleetManagement />,
  bookings: <BookingManagement />,
  finance: <FinanceModule />,
  clients: <ClientCRM />,
  drivers: <DriverManagement />,
  rider: <RiderPortal />,
  dispatcher: <DispatcherConsole />,
  'driver-console': <DriverConsole />
}

const roleNav: Record<Role, { key: PageKey; label: string }[]> = {
  ceo: [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'fleet', label: 'Fleet' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'finance', label: 'Finance' },
    { key: 'clients', label: 'Clients' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'dispatcher', label: 'Dispatch' },
    { key: 'driver-console', label: 'Driver View' },
    { key: 'rider', label: 'Rider Portal' }
  ],
  dispatcher: [
    { key: 'dispatcher', label: 'Dispatch' },
    { key: 'fleet', label: 'Fleet' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'clients', label: 'Clients' }
  ],
  driver: [
    { key: 'driver-console', label: 'Driver Console' },
    { key: 'rider', label: 'Rider Portal' }
  ],
  rider: [{ key: 'rider', label: 'Rider Portal' }]
}

const roleHome: Record<Role, PageKey> = {
  ceo: 'dashboard',
  dispatcher: 'dispatcher',
  driver: 'driver-console',
  rider: 'rider'
}

const getStoredRole = (): Role => {
  const stored = localStorage.getItem('quanlux-role') as Role | null
  if (!stored || stored === 'ceo') {
    return 'rider'
  }
  return stored
}

const getInitialIntroState = () => {
  if (typeof sessionStorage === 'undefined') return true
  return !sessionStorage.getItem('quanlux-intro-session')
}

export default function App() {
  const { user, isAdmin, signOutUser, loading } = useAuth()
  const [role, setRole] = useState<Role>('rider')
  const [activePage, setActivePage] = useState<PageKey>('rider')
  const [showLogin, setShowLogin] = useState(false)
  const [showIntro, setShowIntro] = useState(getInitialIntroState)

  useEffect(() => {
    if (!user) {
      setRole('rider')
      setActivePage('rider')
      return
    }

    if (isAdmin) {
      const stored = localStorage.getItem('quanlux-role') as Role | null
      const nextRole = stored ?? 'ceo'
      setRole(nextRole)
      setActivePage(roleHome[nextRole])
      return
    }

    const nextRole = getStoredRole()
    setRole(nextRole)
    setActivePage(roleHome[nextRole])
  }, [user, isAdmin])

  useEffect(() => {
    localStorage.setItem('quanlux-role', role)
  }, [role])

  useEffect(() => {
    const allowed = roleNav[role].map((item) => item.key)
    if (!allowed.includes(activePage)) {
      setActivePage(roleHome[role])
    }
  }, [role, activePage])

  const headerCopy = useMemo(() => pageCopy[activePage], [activePage])

  const handleIntroComplete = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('quanlux-intro-session', 'seen')
    }
    setShowIntro(false)
  }

  const handleAuthAction = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }
    await signOutUser()
    setRole('rider')
    setActivePage('rider')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading console...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0c0e12] to-black text-white">
      {showIntro ? <IntroOverlay onComplete={handleIntroComplete} /> : null}
      {showLogin ? <AdminLogin onClose={() => setShowLogin(false)} /> : null}
      <div className="flex">
        <Sidebar active={activePage} items={roleNav[role]} onChange={setActivePage} />
        <main className="flex-1 px-6 pb-12 pt-10 lg:px-10">
          <Header
            title={headerCopy.title}
            subtitle={headerCopy.subtitle}
            actions={
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-2 text-xs text-muted-foreground">
                  <UserCircle2 size={14} />
                  <select
                    className="bg-transparent text-xs text-muted-foreground"
                    value={role}
                    onChange={(event) => setRole(event.target.value as Role)}
                    disabled={!isAdmin}
                  >
                    <option value="ceo">CEO</option>
                    <option value="dispatcher">Dispatcher</option>
                    <option value="driver">Driver</option>
                    <option value="rider">Rider</option>
                  </select>
                </div>
                <button
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-4 py-2 text-sm text-muted-foreground"
                  onClick={handleAuthAction}
                >
                  <ShieldCheck size={16} />
                  {user ? (isAdmin ? 'Sign out' : 'Signed in') : 'Admin Login'}
                </button>
              </div>
            }
          />
          <div className="mt-8">{pageComponents[activePage]}</div>
        </main>
      </div>
      <Toaster richColors theme="dark" />
    </div>
  )
}
