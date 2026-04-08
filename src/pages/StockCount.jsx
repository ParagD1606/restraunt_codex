import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { ScanBarcode, ChevronRight, Sparkles } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Badge } from '@/ui/badge'
import { Progress } from '@/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'

/** Predictive order: high velocity + low cover first */
function predictiveOrder(ings) {
  return [...ings].sort((a, b) => {
    const ra = a.qty / a.par
    const rb = b.qty / b.par
    return ra - rb
  })
}

export default function StockCount() {
  const storeIngs = useInventoryStore((s) => s.ingredients)
  const start = useInventoryStore((s) => s.startCountSession)
  const setVal = useInventoryStore((s) => s.setCountValue)
  const scan = useInventoryStore((s) => s.scanBarcode)
  const next = useInventoryStore((s) => s.nextCountItem)
  const session = useInventoryStore((s) => s.countSession)

  const [modal, setModal] = useState(null)
  const ordered = predictiveOrder(storeIngs)
  const current = ordered[session.index % ordered.length]

  const active = session.active
  const progress = active ? ((session.index + 1) / ordered.length) * 100 : 0

  const submitCount = () => {
    if (!current) return
    const entered = parseFloat(session.values[current.id] ?? current.qty)
    if (Number.isNaN(entered)) return
    setVal(current.id, entered)
    const sys = current.qty
    if (Math.abs(entered - sys) > 0.01 && Math.abs(entered - sys) / Math.max(sys, 1) > 0.08) {
      setModal({
        ingredient: current,
        entered,
        sys,
        suggestion:
          entered < sys
            ? 'Likely unrecorded waste during brunch prep — suggest FIFO audit on butter adjacent SKUs.'
            : 'Possible duplicate receive or unit mismatch — verify case vs each.',
      })
    } else {
      next()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Stock count</h1>
        <p className="mt-1 text-sm text-zinc-500">Guided mode · predictive SKU order · barcode simulation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Start a walk-through; discrepancies trigger AI assist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!active ? (
            <Button
              onClick={() => {
                start()
              }}
            >
              Start guided count
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500">
                  <span>Progress</span>
                  <span>
                    {session.index + 1} / {ordered.length}
                  </span>
                </div>
                <Progress value={progress} />
              </div>

              {current && (
                <Motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="ai">Predictive next</Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="default" className="cursor-help">
                            Why this SKU?
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          Lowest cover vs par in model — counts here reduce stock-out risk fastest.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{current.name}</h3>
                  <p className="text-xs text-zinc-500">
                    System on-hand: <span className="font-mono text-zinc-300">{current.qty}</span> {current.unit}
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label className="mb-1 block text-[10px] uppercase text-zinc-500">Physical count</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter count"
                        value={session.values[current.id] ?? ''}
                        onChange={(e) => setVal(current.id, e.target.value)}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      type="button"
                      className="gap-2"
                      onClick={() => {
                        scan(current.id)
                      }}
                    >
                      <ScanBarcode className="h-4 w-4" />
                      Simulate scan
                    </Button>
                    <Button type="button" onClick={submitCount} className="gap-1">
                      Submit <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {session.scanned.includes(current.id) && (
                    <p className="mt-2 text-[11px] text-emerald-400/90">Barcode verified (demo)</p>
                  )}
                </Motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Predictive count list</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-zinc-400">
            {ordered.slice(0, 6).map((ing, i) => (
              <li key={ing.id} className="flex justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                <span>
                  {i + 1}. {ing.name}
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  {ing.qty}/{ing.par} {ing.unit}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Dialog open={!!modal} onOpenChange={() => setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" />
              Discrepancy detected
            </DialogTitle>
          </DialogHeader>
          {modal && (
            <div className="space-y-3 text-sm text-zinc-400">
              <p>
                <strong className="text-white">{modal.ingredient.name}</strong>: you entered{' '}
                <span className="font-mono text-amber-200">{modal.entered}</span> vs system{' '}
                <span className="font-mono text-zinc-300">{modal.sys}</span>.
              </p>
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/10 p-3 text-xs leading-relaxed text-violet-100/90">
                AI suggestion: {modal.suggestion}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    setModal(null)
                    next()
                  }}
                >
                  Accept & continue
                </Button>
                <Button variant="secondary" onClick={() => setModal(null)}>
                  Adjust count
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
