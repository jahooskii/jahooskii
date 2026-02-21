import { useEffect, useMemo, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'
import { Booking } from '@/types'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { formatDateInTimeZone, getStoredTimeZone } from '@/utils/timezone'
import { formatCurrency } from '@/utils/format'
import { Download, Sparkles, Wand2 } from 'lucide-react'

const createBarcodeId = () => `QX-${Date.now().toString().slice(-8)}`

const createDraftBooking = (): Booking => ({
  id: `BK-${Date.now()}`,
  pickup: '',
  destination: '',
  date: new Date().toISOString().split('T')[0],
  chauffeur: 'Assign later',
  status: 'confirmed',
  price: 0,
  barcodeId: createBarcodeId()
})

export const LuxurySupportAI = () => {
  const { upsertBooking, bookings } = useData()
  const { isAdmin } = useAuth()
  const [draft, setDraft] = useState<Booking>(createDraftBooking)
  const [isGenerating, setIsGenerating] = useState(false)
  const barcodeRef = useRef<SVGSVGElement>(null)
  const timeZone = getStoredTimeZone()

  const lastBooking = useMemo(() => bookings[0], [bookings])

  useEffect(() => {
    if (!barcodeRef.current || !draft.barcodeId) return
    JsBarcode(barcodeRef.current, draft.barcodeId, {
      format: 'CODE128',
      width: 2,
      height: 48,
      displayValue: false
    })
  }, [draft.barcodeId])

  const handleGenerate = async () => {
    if (!draft.pickup || !draft.destination) return
    setIsGenerating(true)
    await upsertBooking({ ...draft, id: draft.id || `BK-${Date.now()}` })
    setDraft(createDraftBooking())
    setIsGenerating(false)
  }

  const handleDownloadBarcode = () => {
    const svg = barcodeRef.current
    if (!svg) return

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
      link.download = `Booking-${draft.barcodeId}.png`
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-black/30 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-300">Luxury Support AI</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Request luxury support</h3>
          <p className="text-xs text-muted-foreground">
            Smart booking assistant with instant confirmation barcode.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-300">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <input
          type="text"
          value={draft.pickup}
          onChange={(event) => setDraft({ ...draft, pickup: event.target.value })}
          placeholder="Pickup location"
          className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
          disabled={!isAdmin}
        />
        <input
          type="text"
          value={draft.destination}
          onChange={(event) => setDraft({ ...draft, destination: event.target.value })}
          placeholder="Destination"
          className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
          disabled={!isAdmin}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="date"
            value={draft.date}
            onChange={(event) => setDraft({ ...draft, date: event.target.value })}
            className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
            disabled={!isAdmin}
          />
          <input
            type="number"
            value={draft.price}
            onChange={(event) => setDraft({ ...draft, price: parseFloat(event.target.value) || 0 })}
            placeholder="Estimated price"
            className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
            disabled={!isAdmin}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-black/50 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Confirmation barcode</p>
          <p className="text-xs font-mono text-gold-300">{draft.barcodeId}</p>
        </div>
        <div className="mt-3 flex items-center justify-center rounded-lg bg-white/5 p-2">
          <svg ref={barcodeRef} className="w-full max-w-xs" />
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleDownloadBarcode}
            className="flex-1 rounded-lg border border-border/60 bg-black/40 px-3 py-2 text-xs text-gold-300"
          >
            <span className="inline-flex items-center gap-1">
              <Download size={12} /> Download barcode
            </span>
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!isAdmin || isGenerating}
            className="flex-1 rounded-lg bg-gold-500/90 px-3 py-2 text-xs font-semibold text-black disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-1">
              <Wand2 size={12} /> {isGenerating ? 'Saving...' : 'Create booking'}
            </span>
          </button>
        </div>
      </div>

      {lastBooking ? (
        <div className="mt-4 rounded-xl border border-border/60 bg-black/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Latest booking</p>
          <p className="mt-2 text-sm font-semibold text-white">{lastBooking.pickup} → {lastBooking.destination}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateInTimeZone(lastBooking.date, timeZone)} • {formatCurrency(lastBooking.price)}
          </p>
          {lastBooking.barcodeId ? (
            <p className="mt-2 text-xs font-mono text-gold-300">{lastBooking.barcodeId}</p>
          ) : null}
        </div>
      ) : null}

      {!isAdmin ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Only CEO can create bookings. You can view updates here.
        </p>
      ) : null}
    </div>
  )
}
