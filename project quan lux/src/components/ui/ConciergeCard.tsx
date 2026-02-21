import { useState, useEffect, useRef } from 'react'
import { Client } from '@/types'
import { Edit2, Save, X, Download, Share2 } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import { formatDateInTimeZone, getStoredTimeZone } from '@/utils/timezone'

interface ConciergeCardProps {
  client: Client
  onUpdate: (client: Client) => void
  isAdmin: boolean
}

export const ConciergeCard = ({ client, onUpdate, isAdmin }: ConciergeCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(client)
  const barcodeRef = useRef<SVGSVGElement>(null)
  const timeZone = getStoredTimeZone()

  useEffect(() => {
    if (barcodeRef.current && client.id) {
      try {
        JsBarcode(barcodeRef.current, `QAN-${client.id.toUpperCase()}`, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: false,
          margin: 0,
        })
      } catch (error) {
        console.error('Barcode error:', error)
      }
    }
  }, [client.id])

  const handleSave = async () => {
    await onUpdate(editData)
    setIsEditing(false)
  }

  const handleChange = (field: keyof Client, value: any) => {
    setEditData({ ...editData, [field]: value })
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
      link.download = `${client.name}-Barcode.png`
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleShareBarcode = () => {
    const text = `🏆 VIP Client: ${client.name}\n📱 ID: QAN-${client.id.toUpperCase()}\n💎 Lifetime Value: ₦${(client.lifetimeValue / 1000).toFixed(0)}K\n\nFrom Quan Lux Luxury Services`

    if (navigator.share) {
      navigator.share({
        title: 'Quan Lux Client',
        text: text,
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Barcode info copied to clipboard!')
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-black/30 p-4 space-y-3">
      <div className="flex justify-center mb-3 p-2 bg-white/5 rounded-lg">
        <svg ref={barcodeRef} className="w-full max-w-xs" />
      </div>

      <p className="text-xs text-center text-gold-300 font-mono font-semibold">
        QAN-{client.id.toUpperCase()}
      </p>

      {isEditing ? (
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Name</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-2 py-1 bg-black/50 border border-border rounded text-sm text-white placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Phone</label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-2 py-1 bg-black/50 border border-border rounded text-sm text-white placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Itinerary Date</label>
            <input
              type="date"
              value={editData.itineraryDate || ''}
              onChange={(e) => handleChange('itineraryDate', e.target.value)}
              className="w-full px-2 py-1 bg-black/50 border border-border rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Destination Location</label>
            <input
              type="text"
              value={editData.itineraryLocation || ''}
              onChange={(e) => handleChange('itineraryLocation', e.target.value)}
              placeholder="e.g., Lekki, Lagos"
              className="w-full px-2 py-1 bg-black/50 border border-border rounded text-sm text-white placeholder-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Status</label>
            <select
              value={editData.status}
              onChange={(e) => handleChange('status', e.target.value as any)}
              className="w-full px-2 py-1 bg-black/50 border border-border rounded text-sm text-white"
            >
              <option value="vip">VIP</option>
              <option value="corporate">Corporate</option>
              <option value="standard">Standard</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-gold-400/20 text-gold-300 rounded text-xs font-semibold hover:bg-gold-400/30 transition"
            >
              <Save className="w-3 h-3" /> Save
            </button>
            <button
              onClick={() => {
                setEditData(client)
                setIsEditing(false)
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-rose-500/20 text-rose-400 rounded text-xs font-semibold hover:bg-rose-500/30 transition"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="text-sm font-semibold text-white">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.phone}</p>
          </div>

          {editData.itineraryDate && (
            <div className="pt-2 border-t border-border/40 space-y-1">
              {editData.itineraryDate && (
                <p className="text-xs text-gold-300">
                  📅 {formatDateInTimeZone(editData.itineraryDate, timeZone)}
                </p>
              )}
              {editData.itineraryLocation && (
                <p className="text-xs text-gold-300">
                  📍 {editData.itineraryLocation}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            ₦{(client.lifetimeValue / 1000).toFixed(0)}K lifetime value
          </p>

          <div className="flex gap-2 pt-2">
            {isAdmin && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold hover:bg-blue-500/30 transition"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            )}
            <button
              onClick={handleDownloadBarcode}
              className="flex items-center justify-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-semibold hover:bg-emerald-500/30 transition"
              title="Download barcode as PNG"
            >
              <Download className="w-3 h-3" />
            </button>
            <button
              onClick={handleShareBarcode}
              className="flex items-center justify-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-semibold hover:bg-purple-500/30 transition"
              title="Share barcode"
            >
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
