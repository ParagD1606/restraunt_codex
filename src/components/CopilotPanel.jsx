import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, PanelRightClose, Sparkles, Mic, Camera } from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Button } from '@/ui/button'
import { ScrollArea } from '@/ui/scroll-area'
import { Input } from '@/ui/input'
import { useTypingEffect } from '@/hooks/useTypingEffect'
import { cn } from '@/lib/utils'

function MessageBubble({ msg, isLatest }) {
  const typed = useTypingEffect(msg.text, 12, msg.role === 'assistant' && isLatest)
  const display = msg.role === 'assistant' && isLatest ? typed : msg.text

  return (
    <div
      className={cn(
        'max-w-[95%] rounded-xl px-3 py-2 text-xs leading-relaxed',
        msg.role === 'user'
          ? 'ml-auto bg-violet-600/30 text-violet-100'
          : 'mr-auto border border-white/10 bg-white/[0.04] text-zinc-300'
      )}
    >
      {msg.role === 'assistant' && (
        <div className="mb-1 flex items-center gap-1 text-[10px] font-medium text-violet-400">
          <Sparkles className="h-3 w-3" />
          Copilot
        </div>
      )}
      <div className="whitespace-pre-wrap">{display}</div>
    </div>
  )
}

export function CopilotPanel({ collapsed }) {
  const open = useInventoryStore((s) => s.copilotOpen)
  const setOpen = useInventoryStore((s) => s.setCopilotOpen)
  const messages = useInventoryStore((s) => s.copilotMessages)
  const send = useInventoryStore((s) => s.sendCopilotMessage)
  const [text, setText] = useState('')

  if (collapsed || !open) return null

  const lastId = messages[messages.length - 1]?.id

  return (
    <Motion.aside
      initial={false}
      animate={{ width: 320, opacity: 1 }}
      className="hidden max-h-[calc(100dvh-3.5rem)] min-h-0 shrink-0 border-l border-white/[0.06] bg-[#0a0a10]/95 xl:flex xl:flex-col"
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-300">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Inventory Copilot</p>
            <p className="text-[10px] text-zinc-500">GPT-5 class · on-device routing (demo)</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Close copilot">
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-1 border-b border-white/[0.06] px-2 py-2">
        <Button variant="secondary" size="sm" className="h-7 flex-1 text-[10px]" onClick={() => send('Predict tomorrow shortages')}>
          Shortages
        </Button>
        <Button variant="secondary" size="sm" className="h-7 flex-1 text-[10px]" onClick={() => send('fix inventory')}>
          Fix
        </Button>
      </div>

      <ScrollArea className="h-[min(420px,calc(100dvh-14rem))] px-3 py-3">
        <div className="flex flex-col gap-2 pr-2">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <Motion.div key={m.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <MessageBubble msg={m} isLatest={m.id === lastId && m.role === 'assistant'} />
              </Motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="border-t border-white/[0.06] p-2">
        <div className="mb-2 flex gap-1">
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-zinc-500">
            <Mic className="h-3 w-3" /> Voice count
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] text-zinc-500">
            <Camera className="h-3 w-3" /> Shelf scan
          </span>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            send(text.trim())
            setText('')
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask inventory…"
            className="h-9 flex-1"
          />
          <Button type="submit" size="icon" className="h-9 w-9 shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Motion.aside>
  )
}
