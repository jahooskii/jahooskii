import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { Booking } from '@/types'
import { formatCurrency } from '@/utils/format'
import { formatDateInTimeZone, getStoredTimeZone } from '@/utils/timezone'
import { Download, Trash2 } from 'lucide-react'

const createBarcodeId = () => `QX-${Date.now().toString().slice(-8)}`

const emptyBooking: Booking = {
  id: `BK-${Date.now()}`,
  pickup: '',
  destination: '',
  date: new Date().toISOString().split('T')[0],
  chauffeur: '',
  status: 'confirmed',
  price: 0,
  barcodeId: createBarcodeId()
}

const BookingBarcode = ({ value }: { value?: string }) => {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!barcodeRef.current || !value) return
    JsBarcode(barcodeRef.current, value, {
      format: 'CODE128',
      width: 2,
      height: 40,
      displayValue: false,
      margin: 0
    })
  }, [value])

  if (!value) return null

  return (
    <div className="rounded-lg border border-border/60 bg-black/40 p-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Confirmation barcode</p>
        <p className="text-xs font-mono text-gold-300">{value}</p>
      </div>
      <div className="mt-2 flex items-center justify-center bg-white/5 rounded-lg p-2">
        <svg ref={barcodeRef} className="w-full max-w-xs" />
      </div>
    </div>
  )
}

export const BookingManagement = () => {
  const { bookings, upsertBooking, removeBooking } = useData()
  const { isAdmin } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Booking | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newBooking, setNewBooking] = useState<Booking>(emptyBooking)
  const timeZone = getStoredTimeZone()

  const handleEditClick = (booking: Booking) => {
    setEditingId(booking.id)
    setEditData({ ...booking })
  }

  const handleSaveEdit = async () => {
    if (editData) {
      await upsertBooking(editData)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleAddBooking = async () => {
    if (newBooking.pickup && newBooking.destination && newBooking.chauffeur) {
      const payload = {
        ...newBooking,
        id: newBooking.id || `BK-${Date.now()}`,
        barcodeId: newBooking.barcodeId || createBarcodeId()
      }
      await upsertBooking(payload)
      setNewBooking({ ...emptyBooking, id: `BK-${Date.now()}` })
      setShowAddForm(false)
    }
  }

  const handleDownloadBarcode = (barcodeId?: string) => {
    if (!barcodeId) return
    const svg = document.createElement('svg')
    JsBarcode(svg, barcodeId, { format: 'CODE128', width: 2, height: 50, displayValue: false })
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${barcodeId}.png`
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="grid gap-6">
      <SectionCard
        title="Active bookings"
        subtitle="Monitor all active itineraries and chauffeur assignments"
      >
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isEditing = editingId === booking.id
            const data = isEditing && editData ? editData : booking

            return (
              <div
                key={booking.id}
                className="rounded-xl border border-border/60 bg-black/30 p-4"
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={data.pickup}
                      onChange={(e) => setEditData({ ...data, pickup: e.target.value })}
                      placeholder="Pickup location"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.destination}
                      onChange={(e) => setEditData({ ...data, destination: e.target.value })}
                      placeholder="Destination"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => setEditData({ ...data, date: e.target.value })}
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={data.chauffeur}
                      onChange={(e) => setEditData({ ...data, chauffeur: e.target.value })}
                      placeholder="Chauffeur name"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) => setEditData({ ...data, price: parseFloat(e.target.value) || 0 })}
                      placeholder="Price"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <select
                      value={data.status}
                      onChange={(e) => setEditData({ ...data, status: e.target.value as any })}
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-gold-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 rounded-full border border-border/60 bg-black/40 px-4 py-2 text-sm text-muted-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{booking.pickup}</p>
                        <p className="text-xs text-muted-foreground">→ {booking.destination}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDateInTimeZone(booking.date, timeZone)} • {booking.chauffeur}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gold-300">{formatCurrency(booking.price)}</p>
                        <StatusPill status={booking.status} />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <BookingBarcode value={booking.barcodeId} />
                      {booking.barcodeId ? (
                        <button
                          onClick={() => handleDownloadBarcode(booking.barcodeId)}
                          className="flex items-center gap-2 rounded-full border border-border/60 bg-black/40 px-3 py-2 text-xs text-gold-300"
                        >
                          <Download size={14} /> Download barcode
                        </button>
                      ) : null}
                    </div>
                    {isAdmin && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="flex-1 rounded-full border border-gold-400/60 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300 hover:bg-gold-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeBooking(booking.id)}
                          className="rounded-full border border-rose-400/60 bg-rose-500/10 p-2 text-rose-200 hover:bg-rose-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      {isAdmin && (
        <SectionCard title="New booking" subtitle="Create a new ride booking">
          {showAddForm ? (
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newBooking.pickup}
                onChange={(e) => setNewBooking({ ...newBooking, pickup: e.target.value })}
                placeholder="Pickup location"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="text"
                value={newBooking.destination}
                onChange={(e) => setNewBooking({ ...newBooking, destination: e.target.value })}
                placeholder="Destination"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                value={newBooking.chauffeur}
                onChange={(e) => setNewBooking({ ...newBooking, chauffeur: e.target.value })}
                placeholder="Chauffeur name"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="number"
                value={newBooking.price}
                onChange={(e) => setNewBooking({ ...newBooking, price: parseFloat(e.target.value) || 0 })}
                placeholder="Price"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <select
                value={newBooking.status}
                onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as any })}
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex gap-2 md:col-span-2">
                <button
                  onClick={handleAddBooking}
                  className="flex-1 rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-gold-500"
                >
                  Add Booking
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-full border border-border/60 bg-black/40 px-4 py-2 text-sm text-muted-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-gold-500"
            >
              + Add New Booking
            </button>
          )}
        </SectionCard>
      )}
    </div>
  )
}
