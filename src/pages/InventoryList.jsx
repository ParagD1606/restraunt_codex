import { useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Search, AlertTriangle } from 'lucide-react'
import { vendors, locations } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Badge } from '@/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { formatCurrency } from '@/lib/utils'

export default function InventoryList() {
  const ingredients = useInventoryStore((s) => s.ingredients)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const categories = useMemo(() => {
    const s = new Set(ingredients.map((i) => i.category))
    return ['all', ...[...s]]
  }, [ingredients])

  const filtered = useMemo(() => {
    return ingredients.filter((i) => {
      const okCat = cat === 'all' || i.category === cat
      const okQ =
        !q.trim() ||
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.sku.toLowerCase().includes(q.toLowerCase())
      return okCat && okQ
    })
  }, [ingredients, q, cat])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Inventory</h1>
        <p className="mt-1 text-sm text-zinc-500">Live stock levels · local filters</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">All SKUs</CardTitle>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU…" className="pl-8" />
            </div>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="h-9 rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-200"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="border-b border-white/[0.06] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">On hand</th>
                <th className="px-4 py-3 font-medium">Par</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing, i) => {
                const ratio = ing.qty / ing.par
                const vendor = vendors.find((v) => v.id === ing.vendorId)
                const loc = locations.find((l) => l.id === ing.locationId)
                const risk = ratio < 0.45
                return (
                  <Motion.tr
                    key={ing.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-mono text-zinc-500">{ing.sku}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-zinc-200">{ing.name}</span>
                      <p className="text-[10px] text-zinc-600">{ing.category}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{loc?.name}</td>
                    <td className="px-4 py-3 tabular-nums text-white">
                      {ing.qty} {ing.unit}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-500">{ing.par}</td>
                    <td className="px-4 py-3 tabular-nums text-zinc-300">{formatCurrency(ing.qty * ing.costPerUnit)}</td>
                    <td className="px-4 py-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex">
                              {risk ? (
                                <Badge variant="danger" className="cursor-help gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Low
                                </Badge>
                              ) : (
                                <Badge variant="success">OK</Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {risk
                              ? `Below 45% of par — Copilot suggests reorder from ${vendor?.name ?? 'vendor'}.`
                              : 'Within acceptable cover for modeled demand.'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  </Motion.tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-8 text-center text-sm text-zinc-500">No items match filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
