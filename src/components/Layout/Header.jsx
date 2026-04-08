import { Menu, Search, Bell, Command } from 'lucide-react'
import { Button } from '@/ui/button'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Switch } from '@/ui/switch'
import { Label } from '@/ui/label'

export function Header({ onMenu }) {
  const setCommand = useInventoryStore((s) => s.setCommandOpen)
  const addNotification = useInventoryStore((s) => s.addNotification)
  const skeleton = useInventoryStore((s) => s.skeletonDemo)
  const setSkeleton = useInventoryStore((s) => s.setSkeletonDemo)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/[0.06] bg-[#07070c]/80 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCommand(true)} aria-label="Command">
          <Search className="h-5 w-5" />
        </Button>
        <button
          type="button"
          onClick={() => setCommand(true)}
          className="hidden h-9 max-w-md flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left text-xs text-zinc-500 transition-colors hover:border-white/15 hover:bg-white/[0.05] md:flex lg:min-w-[320px]"
        >
          <Search className="h-3.5 w-3.5" />
          Search or jump…
          <span className="ml-auto flex items-center gap-0.5 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
            <Command className="h-3 w-3" />
            K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <Label htmlFor="skel" className="text-[10px] text-zinc-600">
            Demo skeletons
          </Label>
          <Switch id="skel" checked={skeleton} onCheckedChange={setSkeleton} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-zinc-400"
          onClick={() =>
            addNotification({
              type: 'info',
              title: 'Draft PO ready',
              body: 'Vermouth + butter — review in Receiving',
            })
          }
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 ring-2 ring-[#07070c]" />
        </Button>
      </div>
    </header>
  )
}
