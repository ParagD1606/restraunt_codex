import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/ui/tooltip'
import { AppShell } from '@/components/Layout/AppShell'
import Dashboard from '@/pages/Dashboard'
import InventoryList from '@/pages/InventoryList'
import Receiving from '@/pages/Receiving'
import StockCount from '@/pages/StockCount'
import Recipes from '@/pages/Recipes'
import Waste from '@/pages/Waste'
import Transfers from '@/pages/Transfers'
import Reports from '@/pages/Reports'
import CopilotPage from '@/pages/CopilotPage'

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<InventoryList />} />
            <Route path="/receiving" element={<Receiving />} />
            <Route path="/stock-count" element={<StockCount />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/waste" element={<Waste />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/copilot" element={<CopilotPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
