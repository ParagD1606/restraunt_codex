import { motion as Motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { aiInsights, stockHistory, costTrend, shortagePredictions, anomalyAlerts, sopChecklist, locations } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { InsightCard } from '@/components/InsightCard'
import { HealthScoreRing } from '@/components/HealthScoreRing'
import { RiskHeatmap } from '@/components/RiskHeatmap'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Skeleton } from '@/ui/skeleton'
import { Progress } from '@/ui/progress'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, CloudSun, Smile, Wand2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

function computeHealth(ingredients) {
  if (!ingredients.length) return 0
  let score = 100
  for (const ing of ingredients) {
    const ratio = ing.qty / ing.par
    if (ratio < 0.35) score -= 8
    else if (ratio < 0.55) score -= 4
  }
  return Math.max(52, Math.min(98, Math.round(score)))
}

export default function Dashboard() {
  const ingredients = useInventoryStore((s) => s.ingredients)
  const skeleton = useInventoryStore((s) => s.skeletonDemo)
  const health = computeHealth(ingredients)

  const totalVal = ingredients.reduce((a, i) => a + i.qty * i.costPerUnit, 0)

  if (skeleton) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Overview
          </Motion.h1>
          <p className="mt-1 text-sm text-zinc-500">
            AI-native control tower · {locations.length} locations · live demo data
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/receiving">
            <Button size="sm" variant="secondary">
              Receive invoice <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/reports">
            <Button size="sm">NL reports</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="glass border-white/[0.06] lg:col-span-4">
          <CardHeader>
            <CardTitle>Inventory health</CardTitle>
            <CardDescription>Weighted by pars, spoilage risk, and variance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <HealthScoreRing score={health} />
            <div className="flex-1 space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-500">
                <span>On-hand value</span>
                <span className="font-mono text-white">{formatCurrency(totalVal)}</span>
              </div>
              <Progress value={Math.min(100, (totalVal / 95000) * 100)} />
              <p className="text-[11px] text-zinc-600">
                Mood-based demand and weather-aware forecasts are blended into this score (demo).
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/[0.06] lg:col-span-8">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Stock value trend</CardTitle>
              <CardDescription>7-day on-hand valuation</CardDescription>
            </div>
            <Badge variant="ai">Timeline replay</Badge>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockHistory}>
                <defs>
                  <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525b" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <RTooltip
                  contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#a78bfa" fill="url(#fillStock)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="glass border-white/[0.06]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-violet-400" />
              Restaurant Brain
            </CardTitle>
            <CardDescription>Cross-signals in plain language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-zinc-500">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <CloudSun className="h-4 w-4 text-amber-400" />
              Patio index up — veg sides model +14% vs baseline.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <Smile className="h-4 w-4 text-emerald-400" />
              Guest mood telemetry (demo): “celebratory” Fri peak → premium protein pull.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <Wand2 className="h-4 w-4 text-fuchsia-400" />
              Auto PO drafts: 2 pending · staff mistake alerts: 1 open
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/[0.06] lg:col-span-2">
          <CardHeader>
            <CardTitle>AI insights</CardTitle>
            <CardDescription>Prioritized for margin and service risk</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-1">
            {aiInsights.map((ins, i) => (
              <InsightCard key={ins.id} insight={ins} index={i} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Food & beverage cost</CardTitle>
            <CardDescription>Weekly % of net sales (mock)</CardDescription>
          </CardHeader>
          <CardContent className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="week" stroke="#52525b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525b" tick={{ fontSize: 10 }} domain={[15, 35]} />
                <RTooltip contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="food" name="Food %" stroke="#fb7185" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bev" name="Bev %" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk heatmap</CardTitle>
            <CardDescription>Stock-out pressure by location × day</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskHeatmap />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Predicted shortages</CardTitle>
            <CardDescription>Next 48 hours · confidence-adjusted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {shortagePredictions.map((p) => {
              const ing = ingredients.find((i) => i.id === p.ingredientId)
              return (
                <div
                  key={p.ingredientId}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-white">{ing?.name ?? p.ingredientId}</p>
                    <p className="text-[10px] text-zinc-500">{p.driver}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="warn">{Math.round(p.confidence * 100)}% conf</Badge>
                    <p className="mt-1 text-[10px] text-zinc-500">ETA {p.etaHours}h</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI SOP checklist</CardTitle>
              <CardDescription>Generated from your last 14 days of ops</CardDescription>
            </div>
            <Badge variant="ai">Live</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {sopChecklist.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] px-3 py-2 text-sm"
              >
                <span className={s.done ? 'text-emerald-400' : 'text-zinc-600'}>{s.done ? '✓' : '○'}</span>
                <span className={s.done ? 'text-zinc-300' : 'text-zinc-500'}>{s.task}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart anomaly detection</CardTitle>
          <CardDescription>Staff mistake patterns & silent shrink</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {anomalyAlerts.map((a) => (
            <div
              key={a.id}
              className="flex flex-1 items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-100/90"
            >
              <Badge variant="danger">{a.level}</Badge>
              <span>{a.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
