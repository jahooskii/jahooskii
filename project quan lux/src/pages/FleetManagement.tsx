import { useState } from 'react'
import { SectionCard } from '@/components/ui/SectionCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { LiveMap } from '@/components/maps/LiveMap'
import { useData } from '@/context/DataContext'
import { useAuth } from '@/context/AuthContext'
import { Vehicle } from '@/types'
import { PlaneTakeoff, Trash2 } from 'lucide-react'

const emptyVehicle: Vehicle = {
  id: `VH-${Date.now()}`,
  model: '',
  category: 'sedan',
  plate: '',
  status: 'available',
  location: '',
  lat: 6.5244,
  lng: 3.3792
}

export const FleetManagement = () => {
  const { vehicles, upsertVehicle, removeVehicle } = useData()
  const { isAdmin } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Vehicle | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVehicle, setNewVehicle] = useState<Vehicle>(emptyVehicle)

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingId(vehicle.id)
    setEditData({ ...vehicle })
  }

  const handleSaveEdit = async () => {
    if (editData) {
      await upsertVehicle(editData)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleAddVehicle = async () => {
    if (newVehicle.model && newVehicle.plate) {
      const payload = { ...newVehicle, id: newVehicle.id || `VH-${Date.now()}` }
      await upsertVehicle(payload)
      setNewVehicle(emptyVehicle)
      setShowAddForm(false)
    }
  }

  const renderTailOrPlate = (vehicle: Vehicle) => {
    if (vehicle.category === 'jet') {
      return vehicle.tailNumber ? `Tail: ${vehicle.tailNumber}` : 'Tail: —'
    }
    return vehicle.plate
  }

  return (
    <div className="grid gap-6">
      <SectionCard title="Fleet tracking" subtitle="Live GPS positioning for vehicles and jets">
        <LiveMap vehicles={vehicles} />
      </SectionCard>

      <SectionCard title="Fleet lineup" subtitle="Vehicle availability and service readiness">
        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const isEditing = editingId === vehicle.id
            const data = isEditing && editData ? editData : vehicle

            return (
              <div key={vehicle.id} className="rounded-xl border border-border/60 bg-black/30 p-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={data.model}
                      onChange={(e) => setEditData({ ...data, model: e.target.value })}
                      placeholder="Model"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.plate}
                      onChange={(e) => setEditData({ ...data, plate: e.target.value })}
                      placeholder="Plate / Jet Code"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.tailNumber || ''}
                      onChange={(e) => setEditData({ ...data, tailNumber: e.target.value })}
                      placeholder="Tail Number (Jets only)"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setEditData({ ...data, location: e.target.value })}
                      placeholder="Location"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <select
                      value={data.category}
                      onChange={(e) => setEditData({ ...data, category: e.target.value as any })}
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="luxury">Luxury</option>
                      <option value="jet">Private Jet</option>
                    </select>
                    <select
                      value={data.status}
                      onChange={(e) => setEditData({ ...data, status: e.target.value as any })}
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <input
                      type="text"
                      value={data.pilotName || ''}
                      onChange={(e) => setEditData({ ...data, pilotName: e.target.value })}
                      placeholder="Pilot Name (Jets only)"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      value={data.pilotContact || ''}
                      onChange={(e) => setEditData({ ...data, pilotContact: e.target.value })}
                      placeholder="Pilot Contact (Jets only)"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={data.lat}
                      onChange={(e) => setEditData({ ...data, lat: parseFloat(e.target.value) })}
                      placeholder="Latitude"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={data.lng}
                      onChange={(e) => setEditData({ ...data, lng: parseFloat(e.target.value) })}
                      placeholder="Longitude"
                      className="w-full rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
                    />
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
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{vehicle.model}</p>
                          {vehicle.category === 'jet' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/60 bg-gold-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-gold-300">
                              <PlaneTakeoff size={12} /> Private Jet
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.category.toUpperCase()} • {renderTailOrPlate(vehicle)}
                        </p>
                        {vehicle.category === 'jet' ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Pilot: {vehicle.pilotName || '—'} • {vehicle.pilotContact || '—'}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                        <StatusPill status={vehicle.status} />
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="flex-1 rounded-full border border-gold-400/60 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300 hover:bg-gold-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeVehicle(vehicle.id)}
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
        <SectionCard title="Add new vehicle" subtitle="Register a vehicle or jet to the fleet">
          {showAddForm ? (
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newVehicle.model}
                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                placeholder="Model"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="text"
                value={newVehicle.plate}
                onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                placeholder="Plate / Jet Code"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="text"
                value={newVehicle.tailNumber || ''}
                onChange={(e) => setNewVehicle({ ...newVehicle, tailNumber: e.target.value })}
                placeholder="Tail Number (Jets only)"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="text"
                value={newVehicle.location}
                onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                placeholder="Location"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <select
                value={newVehicle.category}
                onChange={(e) => setNewVehicle({ ...newVehicle, category: e.target.value as any })}
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="jet">Private Jet</option>
              </select>
              <select
                value={newVehicle.status}
                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value as any })}
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <input
                type="text"
                value={newVehicle.pilotName || ''}
                onChange={(e) => setNewVehicle({ ...newVehicle, pilotName: e.target.value })}
                placeholder="Pilot Name (Jets only)"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <input
                type="text"
                value={newVehicle.pilotContact || ''}
                onChange={(e) => setNewVehicle({ ...newVehicle, pilotContact: e.target.value })}
                placeholder="Pilot Contact (Jets only)"
                className="rounded-xl border border-border/60 bg-black/40 px-3 py-2 text-sm text-white placeholder-muted-foreground"
              />
              <div className="flex gap-2 md:col-span-2">
                <button
                  onClick={handleAddVehicle}
                  className="flex-1 rounded-full bg-gold-500/90 px-4 py-2 text-sm font-semibold text-black hover:bg-gold-500"
                >
                  Add Vehicle
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
              + Add New Vehicle
            </button>
          )}
        </SectionCard>
      )}
    </div>
  )
}
