import { NavLink } from 'react-router-dom'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Button } from '@/ui/button'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/receiving', label: 'Receiving', icon: Truck },
  { to: '/stock-count', label: 'Stock Count', icon: ClipboardList },
  { to: '/recipes', label: 'Recipes', icon: ChefHat },
  { to: '/waste', label: 'Waste', icon: Trash2 },
  { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/copilot', label: 'Copilot', icon: Bot },
]

export function Sidebar({ mobile, onNavigate }) {
  const setCopilotOpen = useInventoryStore((s) => s.setCopilotOpen)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
          N
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">Nilay</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">Inventory</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => {
              if (item.to === '/copilot') setCopilotOpen(true)
              mobile && onNavigate?.()
            }}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-violet-400' : '')} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300">Restaurant Brain</p>
          <p className="mt-1 text-[11px] leading-snug text-zinc-500">Live sync: POS · weather · events calendar</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2 h-7 w-full text-[10px]"
            onClick={() => setCopilotOpen(true)}
          >
            Open Copilot
          </Button>
        </div>
      </div>
    </div>
  )
}
