import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatCard } from '@/components/ui/StatCard'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { formatCurrency } from '@/utils/format'
import { DollarSign, Wallet, TrendingUp, Receipt } from 'lucide-react'

const FINANCE_SETTINGS_KEY = 'quanlux-finance-settings'

type FinanceSettings = {
  operatingCost: number
  taxRate: number
}

const defaultSettings: FinanceSettings = {
  operatingCost: 150000,
  taxRate: 0.06
}

export const FinanceModule = () => {
  const { revenue, bookings, upsertRevenue } = useData()
  const { isAdmin } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [settings, setSettings] = useState<FinanceSettings>(defaultSettings)

  useEffect(() => {
    const stored = localStorage.getItem(FINANCE_SETTINGS_KEY)
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
      } catch {
        setSettings(defaultSettings)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FINANCE_SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const weeklyRevenue = useMemo(() => revenue.reduce((sum, day) => sum + day.revenue, 0), [revenue])
  const avgTripValue = useMemo(
    () => bookings.length > 0 ? bookings.reduce((sum, b) => sum + b.price, 0) / bookings.length : 0,
    [bookings]
  )
  const outstandingInvoices = useMemo(
    () => bookings.filter((b) => b.status !== 'completed').reduce((sum, b) => sum + b.price, 0),
    [bookings]
  )

  const estimatedTax = useMemo(() => weeklyRevenue * settings.taxRate, [weeklyRevenue, settings.taxRate])
  const netRevenue = useMemo(() => weeklyRevenue - settings.operatingCost - estimatedTax, [weeklyRevenue, settings.operatingCost, estimatedTax])

  const chartData = useMemo(() => revenue.map((day) => ({
    day: day.day,
    revenue: day.revenue,
    average: avgTripValue * 5
  })), [revenue, avgTripValue])

  const handleRevenueEdit = async (dayId: string, newValue: number) => {
    const day = revenue.find((d) => d.id === dayId)
    if (day) {
      await upsertRevenue({ ...day, revenue: newValue })
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Weekly Revenue"
          value={formatCurrency(weeklyRevenue)}
          icon={DollarSign}
          trend="+12%"
        />
        <StatCard
          title="Avg Trip Value"
          value={formatCurrency(avgTripValue)}
          icon={Wallet}
          trend="+8%"
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(outstandingInvoices)}
          icon={TrendingUp}
          trend="-5%"
        />
      </div>

      <SectionCard
        title="Revenue analytics"
        subtitle="Weekly performance with trend analysis"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FDB026" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#FDB026" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #fdb026' }}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="url(#colorRevenue)"
              name="Daily Revenue"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="average"
              fill="#6B7280"
              name="Expected Average"
              opacity={0.5}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard
        title="Revenue breakdown"
        subtitle="Daily revenue summary for the week"
      >
        <div className="space-y-3">
          {revenue.map((day) => {
            const isEditing = editingId === day.id
            const percentOfTotal = ((day.revenue / weeklyRevenue) * 100).toFixed(1)

            return (
              <div
                key={day.id}
                className="rounded-xl border border-border/60 bg-black/30 p-4"
              >
                {isEditing ? (
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">Daily Revenue</label>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                        className="mt-2 w-full rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={() => handleRevenueEdit(day.id, editValue)}
                      className="rounded-lg bg-gold-500/90 px-3 py-2 text-xs font-semibold text-black hover:bg-gold-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-xs text-muted-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold ${isAdmin ? 'cursor-pointer hover:text-gold-200' : ''} text-gold-300`}
                          onClick={() => {
                            if (isAdmin) {
                              setEditingId(day.id)
                              setEditValue(day.revenue)
                            }
                          }}
                        >
                          {formatCurrency(day.revenue)}
                        </p>
                        <p className="text-xs text-muted-foreground">{percentOfTotal}% of week</p>
                      </div>
                    </div>

                    <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-gold-500 to-gold-300 h-full rounded-full"
                        style={{ width: `${percentOfTotal}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="CEO financial adjustments"
        subtitle="Adjust operating costs and tax to refresh analytics"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-black/30 p-4">
            <p className="text-xs text-muted-foreground">Operating Cost</p>
            {isAdmin ? (
              <input
                type="number"
                value={settings.operatingCost}
                onChange={(e) => setSettings({ ...settings, operatingCost: parseFloat(e.target.value) || 0 })}
                className="mt-3 w-full rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              />
            ) : (
              <p className="mt-3 text-lg font-semibold text-gold-300">{formatCurrency(settings.operatingCost)}</p>
            )}
          </div>
          <div className="rounded-xl border border-border/60 bg-black/30 p-4">
            <p className="text-xs text-muted-foreground">Tax Rate</p>
            {isAdmin ? (
              <input
                type="number"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                className="mt-3 w-full rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              />
            ) : (
              <p className="mt-3 text-lg font-semibold text-gold-300">{Math.round(settings.taxRate * 100)}%</p>
            )}
          </div>
          <div className="rounded-xl border border-border/60 bg-black/30 p-4">
            <p className="text-xs text-muted-foreground">Net Revenue</p>
            <p className="mt-3 text-lg font-semibold text-emerald-300">{formatCurrency(netRevenue)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Tax: {formatCurrency(estimatedTax)}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Invoice center"
        subtitle="Branded invoices with watermark"
      >
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-black/30 p-5"
            >
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                <div className="text-[64px] font-display tracking-[0.4em] text-gold-300">QUAN LUX</div>
              </div>
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Invoice</p>
                  <p className="mt-2 text-lg font-semibold text-white">{booking.pickup} → {booking.destination}</p>
                  <p className="text-xs text-muted-foreground">Booking ID: {booking.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-gold-300">{formatCurrency(booking.price)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Status: {booking.status}</span>
                <span className="inline-flex items-center gap-1 text-gold-300"><Receipt size={14} /> Quan Lux Africa</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Financial summary"
        subtitle="Week overview and payment status"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-black/30 p-6">
            <p className="text-sm text-muted-foreground">Total Weekly Revenue</p>
            <p className="mt-2 text-4xl font-bold text-gold-300">{formatCurrency(weeklyRevenue)}</p>
            <p className="mt-2 text-xs text-emerald-400">↑ 12% from last week</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-black/30 p-6">
            <p className="text-sm text-muted-foreground">Completed Bookings</p>
            <p className="mt-2 text-4xl font-bold text-white">{bookings.filter((b) => b.status === 'completed').length}</p>
            <p className="mt-2 text-xs text-blue-400">
              {bookings.length} total bookings this week
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-black/30 p-6">
            <p className="text-sm text-muted-foreground">Outstanding Amount</p>
            <p className="mt-2 text-4xl font-bold text-rose-400">{formatCurrency(outstandingInvoices)}</p>
            <p className="mt-2 text-xs text-rose-300">
              {bookings.filter((b) => b.status !== 'completed').length} pending bookings
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-black/30 p-6">
            <p className="text-sm text-muted-foreground">Average Trip Value</p>
            <p className="mt-2 text-4xl font-bold text-gold-300">{formatCurrency(avgTripValue)}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Based on {bookings.length} trips
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
