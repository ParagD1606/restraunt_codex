import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { GripVertical, ArrowRight } from 'lucide-react'
import { locations, ingredients as seedIngs } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { cn } from '@/lib/utils'

export default function Transfers() {
  const storeIngs = useInventoryStore((s) => s.ingredients)
  const move = useInventoryStore((s) => s.moveTransferIngredient)
  const transfers = useInventoryStore((s) => s.transfers)

  const [dragging, setDragging] = useState(null)
  const [overLoc, setOverLoc] = useState(null)

  const byLoc = (locId) => storeIngs.filter((i) => i.locationId === locId)

  const onDrop = (toLocId) => {
    if (!dragging) return
    if (dragging.locationId === toLocId) {
      setDragging(null)
      setOverLoc(null)
      return
    }
    move(dragging.id, dragging.locationId, toLocId)
    setDragging(null)
    setOverLoc(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Transfers</h1>
        <p className="mt-1 text-sm text-zinc-500">Drag SKUs between locations (demo)</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {locations.map((loc) => (
          <Card
            key={loc.id}
            className={cn(
              'min-h-[220px] transition-colors',
              overLoc === loc.id && 'ring-2 ring-violet-500/40'
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setOverLoc(loc.id)
            }}
            onDragLeave={() => setOverLoc(null)}
            onDrop={(e) => {
              e.preventDefault()
              onDrop(loc.id)
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{loc.name}</CardTitle>
                <CardDescription>Code {loc.code}</CardDescription>
              </div>
              <Badge variant="default">{byLoc(loc.id).length} SKUs</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {byLoc(loc.id).map((ing) => (
                <Motion.div
                  key={ing.id}
                  layout
                  draggable
                  onDragStart={() => setDragging(ing)}
                  onDragEnd={() => {
                    setDragging(null)
                    setOverLoc(null)
                  }}
                  className="flex cursor-grab items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-zinc-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white">{ing.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      {ing.qty} {ing.unit}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-600" />
                </Motion.div>
              ))}
              {byLoc(loc.id).length === 0 && (
                <p className="py-6 text-center text-xs text-zinc-600">Drop items here</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Transfer ledger</CardTitle>
          <CardDescription>Recent movements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {transfers.map((t) => {
            const ing = seedIngs.find((i) => i.id === t.ingredientId)
            const from = locations.find((l) => l.id === t.from)
            const to = locations.find((l) => l.id === t.to)
            return (
              <div
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-xs"
              >
                <span className="text-zinc-300">{ing?.name ?? t.ingredientId}</span>
                <span className="text-zinc-500">
                  {from?.code} → {to?.code} · {t.qty} {t.unit}
                </span>
                <Badge variant={t.status === 'completed' ? 'success' : 'warn'}>{t.status}</Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
