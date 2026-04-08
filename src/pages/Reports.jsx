import { useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { nlQueryResponses, costTrend } from '@/data/mockData'
import { useInventoryStore } from '@/store/useInventoryStore'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Badge } from '@/ui/badge'
import { Sparkles, RotateCcw } from 'lucide-react'

export default function Reports() {
  const timeline = useInventoryStore((s) => s.timeline)
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const typed = useTypingEffect(answer, 10, !!answer && loading === false)

  const runQuery = (text) => {
    const t = text.trim()
    if (!t) return
    setLoading(true)
    setAnswer('')
    setTimeout(() => {
      const lower = t.toLowerCase()
      let out = nlQueryResponses.default
      if (lower.includes('food cost') || lower.includes('why')) out = nlQueryResponses.foodcost
      else if (lower.includes('waste')) out = nlQueryResponses.waste
      setAnswer(out)
      setLoading(false)
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports & analytics</h1>
        <p className="mt-1 text-sm text-zinc-500">Natural language + classic charts</p>
      </div>

      <Card className="glass border-violet-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Ask your inventory
          </CardTitle>
          <CardDescription>Try: “Why is food cost high this week?”</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              runQuery(q)
            }}
          >
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Why is food cost high this week?"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Analyzing…' : 'Run'}
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {['Why is food cost high this week?', 'Explain waste spike', 'Variance narrative'].map((s) => (
              <Button key={s} type="button" variant="secondary" size="sm" className="h-7 text-[10px]" onClick={() => { setQ(s); runQuery(s) }}>
                {s}
              </Button>
            ))}
          </div>
          {(answer || loading) && (
            <Motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-sm leading-relaxed text-zinc-300"
            >
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 w-[75%] animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-[83%] animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{typed}</div>
              )}
            </Motion.div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost % by week</CardTitle>
            <CardDescription>Mock F&B %</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="week" stroke="#52525b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525b" tick={{ fontSize: 10 }} domain={[15, 35]} />
                <RTooltip contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                <Bar dataKey="food" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Food %" />
                <Bar dataKey="bev" fill="#34d399" radius={[4, 4, 0, 0]} name="Bev %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Timeline replay</CardTitle>
              <CardDescription>Recent inventory mutations</CardDescription>
            </div>
            <Badge variant="ai">Live</Badge>
          </CardHeader>
          <CardContent className="max-h-64 space-y-3 overflow-auto pr-2">
            {timeline.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-0.5 border-l-2 border-violet-500/40 py-1 pl-3 text-xs"
              >
                <span className="font-mono text-[10px] text-zinc-600">{ev.at}</span>
                <span className="text-zinc-200">{ev.label}</span>
                <span className="text-[10px] text-violet-300/80">{ev.delta}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">One-click fixes (demo)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => {
              useInventoryStore.getState().addNotification({
                type: 'success',
                title: 'PO generated',
                body: 'Vermouth + butter draft sent to approvals',
              })
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Auto-generate PO
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              useInventoryStore.getState().addNotification({
                type: 'info',
                title: 'Substitution',
                body: 'Truffle paste → mushroom umami blend for low-cover nights',
              })
            }
          >
            Recipe substitution
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
