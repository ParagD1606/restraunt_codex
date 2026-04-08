import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Truck,
  ClipboardList,
  ChefHat,
  Trash2,
  ArrowLeftRight,
  BarChart3,
  Bot,
  Search,
} from 'lucide-react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Input } from '@/ui/input'
import { cn } from '@/lib/utils'

const commands = [
  { id: 'dash', label: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'inv', label: 'Inventory List', path: '/inventory', icon: Package },
  { id: 'recv', label: 'Receiving · Invoice AI', path: '/receiving', icon: Truck },
  { id: 'count', label: 'Stock Count Mode', path: '/stock-count', icon: ClipboardList },
  { id: 'rec', label: 'Recipes & Consumption', path: '/recipes', icon: ChefHat },
  { id: 'waste', label: 'Waste Tracking', path: '/waste', icon: Trash2 },
  { id: 'xfer', label: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
  { id: 'rep', label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  { id: 'cop', label: 'AI Copilot', path: '/copilot', icon: Bot },
]

export function CommandPalette() {
  const open = useInventoryStore((s) => s.commandOpen)
  const setOpen = useInventoryStore((s) => s.setCommandOpen)
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const nav = useNavigate()

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(s))
  }, [q])

  const safeIdx = Math.min(idx, Math.max(0, filtered.length - 1))

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
      if (!open) return
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIdx((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIdx((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered.length > 0) {
        const i = Math.min(idx, filtered.length - 1)
        nav(filtered[i].path)
        setOpen(false)
        setQ('')
        setIdx(0)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen, filtered, idx, nav])

  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <Motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#12121a] shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                  setIdx(0)
                }}
                placeholder="Jump to screen…"
                className="border-0 bg-transparent focus-visible:ring-0"
                autoFocus
              />
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline">
                ESC
              </kbd>
            </div>
            <ul className="max-h-[50vh] overflow-auto p-2">
              {filtered.map((c, i) => {
                const Icon = c.icon
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => {
                        nav(c.path)
                        setOpen(false)
                        setQ('')
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        i === safeIdx ? 'bg-violet-600/25 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      {c.label}
                    </button>
                  </li>
                )
              })}
              {filtered.length === 0 && (
                <li className="px-3 py-8 text-center text-xs text-zinc-500">No matches</li>
              )}
            </ul>
            <div className="border-t border-white/10 px-3 py-2 text-[10px] text-zinc-600">
              <span className="text-zinc-500">↑↓</span> navigate · <span className="text-zinc-500">↵</span> open
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}
