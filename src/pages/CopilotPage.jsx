import { useEffect, useState } from 'react'
import { Bot, Send, Mic, Camera, Wand2 } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { ScrollArea } from '@/ui/scroll-area'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

function Bubble({ msg, isLatestAssistant }) {
  const display = useTypingEffect(msg.text, 8, msg.role === 'assistant' && isLatestAssistant)
  const text = msg.role === 'assistant' && isLatestAssistant ? display : msg.text

  return (
    <div
      className={cn(
        'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        msg.role === 'user'
          ? 'ml-auto bg-violet-600/25 text-violet-50'
          : 'border border-white/10 bg-white/[0.04] text-zinc-300'
      )}
    >
      {msg.role === 'assistant' && <p className="mb-1 text-[10px] font-semibold text-violet-400">Copilot</p>}
      <div className="whitespace-pre-wrap">{text}</div>
    </div>
  )
}

export default function CopilotPage() {
  const setOpen = useInventoryStore((s) => s.setCopilotOpen)
  const messages = useInventoryStore((s) => s.copilotMessages)
  const send = useInventoryStore((s) => s.sendCopilotMessage)
  const [text, setText] = useState('')

  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  const last = messages[messages.length - 1]

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 pb-24">
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Inventory Copilot</h1>
        <p className="mt-1 text-sm text-zinc-500">Full-page console · same thread as the side panel</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Mic, label: 'Voice count mode', sub: 'Hands-free walk-in' },
          { icon: Camera, label: 'Camera stock estimate', sub: 'Shelf fill % (mock)' },
          { icon: Wand2, label: 'Fix inventory', sub: 'One-click playbooks' },
        ].map((f) => (
          <Card key={f.label} className="border-white/[0.06]">
            <CardContent className="flex gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{f.label}</p>
                <p className="text-[10px] text-zinc-500">{f.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="min-h-[420px] flex-1 border-white/[0.08]">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-white/[0.06]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">Conversation</CardTitle>
            <CardDescription>Context-aware to your live demo store</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex h-[min(52vh,480px)] flex-col p-0">
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="flex flex-col gap-3 pr-3">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <Motion.div key={m.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Bubble msg={m} isLatestAssistant={m.id === last?.id && m.role === 'assistant'} />
                  </Motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <form
            className="border-t border-white/[0.06] p-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!text.trim()) return
              send(text.trim())
              setText('')
            }}
          >
            <div className="flex gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything…" className="flex-1" />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
