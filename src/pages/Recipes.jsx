import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { recipes, ingredients } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import { cn } from '@/lib/utils'

export default function Recipes() {
  const [selected, setSelected] = useState(recipes[0].id)
  const deduct = useInventoryStore((s) => s.deductRecipe)
  const ings = useInventoryStore((s) => s.ingredients)

  const recipe = recipes.find((r) => r.id === selected)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Recipes & consumption</h1>
        <p className="mt-1 text-sm text-zinc-500">Post batches · visual dependency graph (demo)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Menu engineering</CardTitle>
            <CardDescription>Select a recipe card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recipes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r.id)}
                className={cn(
                  'w-full rounded-xl border p-4 text-left transition-all',
                  selected === r.id
                    ? 'border-violet-500/40 bg-violet-500/10'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
                )}
              >
                <div className={cn('mb-2 h-1.5 rounded-full bg-gradient-to-r', r.coverColor)} />
                <p className="font-medium text-white">{r.name}</p>
                <p className="text-[10px] text-zinc-500">{r.servingsPerBatch} servings / batch</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="overflow-hidden lg:col-span-8">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>{recipe?.name}</CardTitle>
              <CardDescription>Ingredient dependency graph</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => deduct(recipe.id, 1)}>
                Post 1 batch
              </Button>
              <Button size="sm" onClick={() => deduct(recipe.id, 3)}>
                Post 3 batches
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[280px] rounded-xl border border-white/[0.06] bg-[#0a0a10] p-6">
              <div className="flex flex-col items-center">
                <Motion.div
                  className={cn(
                    'rounded-xl border border-violet-500/30 bg-violet-500/15 px-6 py-3 text-sm font-semibold text-white'
                  )}
                >
                  {recipe?.name}
                </Motion.div>
                <div className="my-3 h-10 w-px bg-gradient-to-b from-violet-500/50 to-white/20" />
                <div className="grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
                  {recipe?.ingredients.map((li, i) => {
                    const ing = ings.find((x) => x.id === li.ingredientId) ?? ingredients.find((x) => x.id === li.ingredientId)
                    return (
                      <Motion.div
                        key={li.ingredientId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="relative flex flex-col items-center"
                      >
                        <div className="mb-2 h-6 w-px bg-white/15" />
                        <div className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-center">
                          <p className="text-xs font-medium text-white">{ing?.name}</p>
                          <p className="mt-1 font-mono text-[10px] text-zinc-500">
                            −{li.qty} {li.unit} / batch
                          </p>
                          <Badge variant="default" className="mt-2 text-[9px]">
                            On hand {ing?.qty} {ing?.unit}
                          </Badge>
                        </div>
                      </Motion.div>
                    )
                  })}
                </div>
              </div>
              <p className="mt-6 text-center text-[10px] text-zinc-600">
                Auto-deduct runs on batch post · substitution AI suggests swaps when cover &lt; 48h (not wired in demo)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
