import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Vehicle } from '@/types'
import { Car } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

interface LiveMapProps {
  vehicles: Vehicle[]
  height?: string
}

const vehicleIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSIjMEYwRjBGIiBzdHJva2U9IiNGREIwMjYiIHN0cm9rZS13aWR0aD0iMiIvPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgsIDgpIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkRCMDI2IiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvZz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})

function MapUpdater({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap()

  useEffect(() => {
    if (vehicles.length > 0) {
      const center: L.LatLngExpression = [vehicles[0].lat, vehicles[0].lng]
      map.setView(center, 9)
    }
  }, [vehicles, map])

  return null
}

export const LiveMap = ({ vehicles, height = '420px' }: LiveMapProps) => {
  const center: L.LatLngExpression = vehicles[0]
    ? [vehicles[0].lat, vehicles[0].lng]
    : [6.5244, 3.3792]

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-border/60 bg-black/30">
      <MapContainer
        center={center}
        zoom={9}
        style={{ width: '100%', height }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater vehicles={vehicles} />
        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng] as L.LatLngExpression}
            icon={vehicleIcon}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 font-semibold text-gold-300">
                  <Car size={14} />
                  {vehicle.model}
                </div>
                <div className="text-muted-foreground">
                  <div>Plate: {vehicle.plate}</div>
                  <div className="capitalize">{vehicle.status}</div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
