import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatCard } from '@/components/ui/StatCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { ConciergeCard } from '@/components/ui/ConciergeCard'
import { LuxurySupportAI } from '@/components/ui/LuxurySupportAI'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/format'
import { formatDateInTimeZone, getStoredTimeZone } from '@/utils/timezone'
import { TrendingUp, Zap, Crown } from 'lucide-react'

export const Dashboard = () => {
  const { revenue, bookings, drivers, vehicles, clients, upsertClient } = useData()
  const { isAdmin } = useAuth()
  const timeZone = getStoredTimeZone()

  const weeklyRevenue = useMemo(() => revenue.reduce((sum, day) => sum + day.revenue, 0), [revenue])
  const activeDrivers = useMemo(() => drivers.filter((d) => d.status === 'on-trip').length, [drivers])
  const reserveDrivers = useMemo(() => drivers.filter((d) => d.status !== 'on-trip').length, [drivers])
  const availableVehicles = useMemo(() => vehicles.filter((v) => v.status === 'available').length, [vehicles])
  const maintenanceVehicles = useMemo(() => vehicles.filter((v) => v.status === 'maintenance').length, [vehicles])
  const vipClients = useMemo(() => clients.filter((c) => c.status === 'vip').length, [clients])

  const chartData = useMemo(() => revenue.map((day) => ({
    name: day.day,
    revenue: day.revenue / 1000
  })), [revenue])

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed').slice(0, 3),
    [bookings]
  )

  const eliteClients = useMemo(
    () => clients.filter((c) => c.status === 'vip').slice(0, 3),
    [clients]
  )

  const topDrivers = useMemo(
    () => drivers.sort((a, b) => b.rating - a.rating).slice(0, 3),
    [drivers]
  )

  const topVehicles = useMemo(
    () => vehicles.slice(0, 3),
    [vehicles]
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Weekly Revenue"
          value={formatCurrency(weeklyRevenue)}
          icon={TrendingUp}
          trend="+12%"
          subtitle="Last 7 days"
        />
        <StatCard
          title="Active Chauffeurs"
          value={`${activeDrivers} on duty`}
          icon={Zap}
          subtitle={`${reserveDrivers} in reserve`}
        />
        <StatCard
          title="Fleet Readiness"
          value={`${availableVehicles} available`}
          icon={Zap}
          subtitle={`${maintenanceVehicles} in maintenance`}
        />
        <StatCard
          title="VIP Clients"
          value={vipClients.toString()}
          icon={Crown}
          trend="Top-tier loyalty segment"
        />
      </div>

      <SectionCard
        title="Revenue Momentum"
        subtitle="Weekly performance tracking"
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FDB026" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FDB026" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
              }}
              formatter={(value: any) => `₦${Number(value) * 1000}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FDB026"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Immediate departures"
          subtitle="Upcoming chauffeur assignments"
        >
          <div className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-black/30 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.pickup}</p>
                    <p className="text-xs text-muted-foreground">→ {booking.destination}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDateInTimeZone(booking.date, timeZone)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold-300">{formatCurrency(booking.price)}</p>
                    <StatusPill status={booking.status} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-6">No upcoming departures</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Elite client concierge"
          subtitle="Need a bespoke itinerary? Request luxury support"
        >
          <div className="space-y-4">
            {eliteClients.length > 0 ? (
              eliteClients.map((client) => (
                <ConciergeCard
                  key={client.id}
                  client={client}
                  onUpdate={upsertClient}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-6">No VIP clients yet</p>
            )}
          </div>
        </SectionCard>

        <LuxurySupportAI />

        <SectionCard
          title="Fleet spotlight"
          subtitle="Featured vehicles and availability"
        >
          <div className="space-y-3">
            {topVehicles.length > 0 ? (
              topVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-black/30 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                  </div>
                  <div className="text-right">
                    <StatusPill status={vehicle.status} />
                    <p className="mt-2 text-xs text-muted-foreground">{vehicle.location}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-6">No vehicles available</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Chauffeur ratings"
          subtitle="Top-performing drivers"
        >
          <div className="space-y-3">
            {topDrivers.length > 0 ? (
              topDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-black/30 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.tripsThisMonth} trips this month</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < Math.floor(driver.rating) ? 'bg-gold-300' : 'bg-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-gold-300 mt-1">{driver.rating}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground py-6">No drivers available</p>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
