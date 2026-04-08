import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { CopilotPanel } from '@/components/CopilotPanel'
import { CommandPalette } from '@/components/CommandPalette'
import { NotificationHost } from '@/components/NotificationHost'
import { useInventoryStore } from '@/store/useInventoryStore'
import { Button } from '@/ui/button'
import { Bot } from 'lucide-react'

export function AppShell() {
  const [mobileNav, setMobileNav] = useState(false)
  const copilotOpen = useInventoryStore((s) => s.copilotOpen)
  const setCopilotOpen = useInventoryStore((s) => s.setCopilotOpen)

  return (
    <div className="flex min-h-screen bg-grid">
      <aside className="hidden w-56 shrink-0 border-r border-white/[0.06] bg-[#08080f]/90 backdrop-blur-xl md:flex md:flex-col">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {mobileNav && (
          <>
            <Motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              aria-label="Close menu"
              onClick={() => setMobileNav(false)}
            />
            <Motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.06] bg-[#08080f] shadow-2xl md:hidden"
            >
              <Sidebar mobile onNavigate={() => setMobileNav(false)} />
            </Motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenu={() => setMobileNav(true)} />
        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
          <CopilotPanel collapsed={false} />
        </div>
      </div>

      {!copilotOpen && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-[90] h-12 w-12 rounded-full shadow-xl shadow-violet-900/40 xl:hidden"
          onClick={() => setCopilotOpen(true)}
          aria-label="Open copilot"
        >
          <Bot className="h-5 w-5" />
        </Button>
      )}

      <CommandPalette />
      <NotificationHost />
    </div>
  )
}
