import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Trash2, Sparkles } from 'lucide-react'
import { ingredients } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Badge } from '@/ui/badge'
const reasons = ['Spoilage', 'Prep error — over-portion', 'Dropped / broken', 'Guest comp', 'R&D / tasting']

export default function Waste() {
  const wasteLogs = useInventoryStore((s) => s.wasteLogs)
  const addWaste = useInventoryStore((s) => s.addWaste)
  const storeIngs = useInventoryStore((s) => s.ingredients)

  const [ingId, setIngId] = useState(storeIngs[0]?.id ?? '')
  const [qty, setQty] = useState('1')
  const [reason, setReason] = useState(reasons[0])
  const [aiReason, setAiReason] = useState('')

  const suggestReason = () => {
    const ing = storeIngs.find((i) => i.id === ingId)
    if (!ing) return
    if (ing.category === 'Produce') setAiReason('Spoilage — temperature excursion risk on high-turn veg')
    else if (ing.category === 'Protein') setAiReason('Prep error — over-portion vs POS depletion pattern')
    else if (ing.category === 'Dairy') setAiReason('Spoilage — FIFO gap vs expiry window')
    else setAiReason('Staff mistake alert — variance vs similar SKUs')
  }

  const submit = () => {
    const ing = storeIngs.find((i) => i.id === ingId)
    const q = parseFloat(qty)
    if (!ing || Number.isNaN(q) || q <= 0) return
    addWaste({
      ingredientId: ingId,
      qty: q,
      unit: ing.unit,
      reason: aiReason || reason,
    })
    setQty('1')
    setAiReason('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Waste & spoilage</h1>
        <p className="mt-1 text-sm text-zinc-500">Fast capture · AI-suggested reasons</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick log</CardTitle>
            <CardDescription>Two taps + optional AI reason</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ingredient</Label>
              <select
                className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs"
                value={ingId}
                onChange={(e) => setIngId(e.target.value)}
              >
                {storeIngs.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" step="0.01" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <select
                className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="secondary" type="button" className="w-full gap-2" onClick={suggestReason}>
              <Sparkles className="h-4 w-4" />
              AI suggest reason
            </Button>
            {aiReason && (
              <Motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-violet-500/25 bg-violet-500/10 p-3 text-xs text-violet-100/90"
              >
                {aiReason}
              </Motion.p>
            )}
            <Button type="button" className="w-full gap-2" onClick={submit}>
              <Trash2 className="h-4 w-4" />
              Log waste
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent logs</CardTitle>
            <CardDescription>Federated into variance narrative</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {wasteLogs.map((w) => {
              const ing = ingredients.find((i) => i.id === w.ingredientId)
              return (
                <div
                  key={w.id}
                  className="flex flex-col gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-white">{ing?.name}</span>
                    {w.aiSuggested && <Badge variant="ai">AI tagged</Badge>}
                  </div>
                  <p className="text-zinc-500">
                    −{w.qty} {w.unit} · {w.reason}
                  </p>
                  <p className="text-[10px] text-zinc-600">
                    {typeof w.at === 'string' ? w.at.slice(0, 16) : ''} · {w.staff}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
