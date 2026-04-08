import { motion as Motion, AnimatePresence } from 'framer-motion'
import { FileUp, Sparkles, CheckCircle2 } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { ingredients } from '@/data/mockData'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import { ConfidenceMeter } from '@/components/ConfidenceMeter'
import { Skeleton } from '@/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

export default function Receiving() {
  const step = useInventoryStore((s) => s.receivingStep)
  const uiLoading = useInventoryStore((s) => s.uiLoading)
  const lines = useInventoryStore((s) => s.parsedLines)
  const startParse = useInventoryStore((s) => s.startParseInvoice)
  const approve = useInventoryStore((s) => s.approveReceiving)
  const reset = useInventoryStore((s) => s.resetReceiving)
  const updateLine = useInventoryStore((s) => s.updateParsedLine)
  const approved = useInventoryStore((s) => s.receivingApproved)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Receiving</h1>
        <p className="mt-1 text-sm text-zinc-500">Invoice upload → AI extraction → human approval</p>
      </div>

      <div className="flex gap-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        {['upload', 'parsing', 'review', 'done'].map((s, i) => (
          <span
            key={s}
            className={
              ['upload', 'parsing', 'review', 'done'].indexOf(step) >= i ? 'text-violet-400' : ''
            }
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <Motion.div key="up" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="glass border-dashed border-violet-500/30">
              <CardContent className="flex flex-col items-center py-16">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                  <FileUp className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-white">Drop Sysco PDF or tap to upload</p>
                <p className="mt-1 text-xs text-zinc-500">Demo: click below to simulate OCR + GL mapping</p>
                <Button className="mt-6" onClick={startParse}>
                  <Sparkles className="h-4 w-4" />
                  Process invoice INV-2026-8842.pdf
                </Button>
              </CardContent>
            </Card>
          </Motion.div>
        )}

        {step === 'parsing' && (
          <Motion.div key="par" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="ai-shimmer rounded px-2 py-0.5 text-violet-200">Parsing</span>
                  Extracting line items
                </CardTitle>
                <CardDescription>Computer vision + vendor catalog embeddings (mock latency)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </CardContent>
            </Card>
          </Motion.div>
        )}

        {(step === 'review' || step === 'done') && (
          <Motion.div key="rev" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Matched lines</CardTitle>
                  <CardDescription>Adjust mapping before posting to stock</CardDescription>
                </div>
                {approved && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Posted
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {lines.map((line) => {
                  const ing = ingredients.find((x) => x.id === line.matchedIngredientId)
                  return (
                    <div
                      key={line.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-zinc-600">Raw OCR</p>
                          <p className="text-sm text-zinc-200">{line.raw}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Extracted: {line.extractedQty} {line.extractedUnit} @ {formatCurrency(line.unitPrice)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <ConfidenceMeter value={line.confidence} />
                          <div className="min-w-[200px]">
                            <select
                              className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-200"
                              value={line.matchedIngredientId ?? ''}
                              onChange={(e) =>
                                updateLine(line.id, {
                                  matchedIngredientId: e.target.value || null,
                                })
                              }
                            >
                              <option value="">Unmapped</option>
                              {ingredients.map((x) => (
                                <option key={x.id} value={x.id}>
                                  {x.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      {ing && (
                        <p className="mt-2 text-[11px] text-violet-300/90">
                          → Posts to <strong>{ing.name}</strong> ({ing.sku}) · current {ing.qty} {ing.unit}
                        </p>
                      )}
                    </div>
                  )
                })}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button disabled={uiLoading || approved} onClick={approve}>
                    Approve & update inventory
                  </Button>
                  <Button variant="secondary" onClick={reset}>
                    Reset demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
