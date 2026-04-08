# Nilay — AI-First Hospitality Inventory (Frontend Prototype)

**Version:** 0.0.0  
**Type:** Demo / investor-ready UI only — **no backend**, **no real APIs**. All data is mock JSON and in-memory state (Zustand).

---

## 1. What this is

A **next-gen AI-first inventory module** for restaurants, hotels, and cafes. It showcases:

- Receiving with simulated invoice OCR, line matching, confidence scores, and approval → stock update  
- Live-ish inventory, risk views, charts, and an AI Copilot  
- Stock counts, recipes (batch deduct), waste, transfers, and natural-language-style reports  

Competitive positioning is *future-state* (not a clone of Restaurant365, MarketMan, etc.).

---

## 2. Tech stack

| Layer | Choice |
|--------|--------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Components | Radix UI primitives + CVA + `cn()` (shadcn-style patterns) |
| Routing | `react-router-dom` v7 |
| State | Zustand (`src/store/useInventoryStore.js`) |
| Charts | Recharts |
| Motion | Framer Motion (imported as `Motion` in JSX for ESLint compatibility) |
| Icons | Lucide React |

**Path alias:** `@/` → `src/` (see `vite.config.js`, `jsconfig.json`).

---

## 3. Quick start

```bash
cd nilay
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # serve dist locally
npm run lint     # ESLint
```

---

## 4. Project structure

```
src/
  App.jsx                 # Routes
  main.jsx                # Entry
  index.css               # Tailwind + global theme / utilities

  components/             # Feature + layout UI
    Layout/               # AppShell, Sidebar, Header
    CommandPalette.jsx
    CopilotPanel.jsx
    ConfidenceMeter.jsx
    HealthScoreRing.jsx
    InsightCard.jsx
    NotificationHost.jsx
    RiskHeatmap.jsx
    EmptyState.jsx
    ...

  pages/                  # One file per screen
    Dashboard.jsx
    InventoryList.jsx
    Receiving.jsx
    StockCount.jsx
    Recipes.jsx
    Waste.jsx
    Transfers.jsx
    Reports.jsx
    CopilotPage.jsx

  data/
    mockData.js           # Ingredients, vendors, recipes, charts, invoice lines, etc.

  store/
    useInventoryStore.js  # Global state + actions

  hooks/
    useTypingEffect.js    # AI “typing” animation for text

  ui/                     # Reusable primitives (Button, Card, Dialog, …)

  lib/
    utils.js              # cn(), formatCurrency(), formatPct()
```

---

## 5. Routes (screens)

| Path | Page | Purpose |
|------|------|---------|
| `/` | Overview / Dashboard | Health score, trends, insights, heatmap, shortages, SOP, anomalies |
| `/inventory` | Inventory list | Search, category filter, stock status tooltips |
| `/receiving` | Receiving | Fake invoice parse → review → approve → update `ingredients` |
| `/stock-count` | Stock count | Guided count, barcode sim, discrepancy modal |
| `/recipes` | Recipes | Dependency view, post batches → deduct ingredients |
| `/waste` | Waste | Quick log + AI-suggested reason (mock) |
| `/transfers` | Transfers | Drag SKU between location cards |
| `/reports` | Reports | NL-style query + charts + timeline replay |
| `/copilot` | Copilot (full page) | Same chat thread; opens copilot rail on visit |

Shell: **`AppShell`** wraps all routes — sidebar, header, optional **Copilot** rail (wide screens), FAB to reopen copilot on small screens.

---

## 6. Keyboard & UI shortcuts

| Action | Shortcut |
|--------|----------|
| Command palette (jump to any screen) | **Ctrl+K** (Windows/Linux) or **⌘+K** (Mac) |
| Close palette | **Esc** |
| Navigate palette | ↑ / ↓, **Enter** to open |

Header:

- **Search / jump** bar (desktop) opens the command palette  
- **Bell** pushes a fake notification (demo)  
- **Demo skeletons** toggle drives loading skeletons on the dashboard  

---

## 7. Zustand store — state shape (summary)

**Data**

- `ingredients` — on-hand SKUs (qty, par, unit, location, vendor, etc.)  
- `wasteLogs`  
- `timeline` — events for Reports “replay”  
- `transfers` — ledger rows  

**Receiving**

- `receivingStep`: `'upload' | 'parsing' | 'review' | 'done'`  
- `parsedLines` — after fake parse  
- `receivingApproved`  

**Stock count**

- `countSession`: `{ active, index, scanned[], values{} }`  

**UI**

- `copilotOpen`, `copilotMessages[]`  
- `commandOpen`  
- `notifications[]` (toasts auto-dismiss)  
- `uiLoading`, `skeletonDemo`  

---

## 8. Zustand store — actions (API for demos)

| Action | What it does |
|--------|----------------|
| `setCommandOpen(v)` | Show/hide command palette |
| `setCopilotOpen(v)` | Show/hide right Copilot rail |
| `setUiLoading(v)` | Global loading flag (used in receiving flow) |
| `setSkeletonDemo(v)` | Dashboard skeleton mode |
| `startParseInvoice()` | Sets parsing → after delay fills `parsedLines`, toast |
| `approveReceiving()` | Applies matched lines to `ingredients`, timeline, toast |
| `resetReceiving()` | Back to upload, clears parse |
| `updateParsedLine(lineId, patch)` | e.g. remap `matchedIngredientId` |
| `startCountSession()` | Starts guided count |
| `setCountValue(ingredientId, val)` | Physical count input |
| `scanBarcode(ingredientId)` | Marks SKU “scanned” (demo) |
| `nextCountItem()` | Advance count index |
| `addWaste(payload)` | `{ ingredientId, qty, unit, reason }` — decrements stock, log, timeline |
| `deductRecipe(recipeId, batches)` | Subtracts recipe ingredients from stock |
| `completeTransfer(transferId)` | Marks a transfer completed (ledger) |
| `moveTransferIngredient(ingredientId, fromLoc, toLoc)` | **Full move**: updates that row’s `locationId` |
| `sendCopilotMessage(text)` | Appends user msg; fake reply after delay (keyword rules) |
| `addNotification({ type, title, body })` | Push toast (`success` \| `info` \| `warn`) |

**Copilot keyword hints (mock replies):**  
`food cost`, `why is food`, `waste`, `fix inventory`, `shortage`, `tomorrow` — see `sendCopilotMessage` and `src/data/mockData.js` (`nlQueryResponses`).

---

## 9. Mock data (`src/data/mockData.js`)

Exports include (non-exhaustive):

- `locations`, `vendors`, `ingredients`, `recipes`  
- `stockHistory`, `costTrend`, `riskHeatmap`  
- `aiInsights`, `shortagePredictions`, `anomalyAlerts`, `sopChecklist`  
- `mockInvoiceLines` — used after “Process invoice”  
- `initialWasteLogs`, `timelineEvents` (seed timeline)  
- `nlQueryResponses` — canned strings for Reports / Copilot  

Edit this file to change demo content without touching UI logic.

---

## 10. Core user flows (what to click)

1. **Receiving**  
   - Process invoice → wait for parse → adjust dropdowns / see confidence → **Approve & update inventory** → check **Inventory** quantities and **Reports** timeline.

2. **Stock count**  
   - **Start guided count** → enter quantity → **Submit**; large variance vs system opens **AI discrepancy** modal.

3. **Recipes**  
   - Choose recipe → **Post 1 batch** / **Post 3 batches** → ingredient quantities drop.

4. **Waste**  
   - Pick SKU, qty, reason → optional **AI suggest reason** → **Log waste**.

5. **Transfers**  
   - **Drag** a row from one location card onto another → SKU’s `locationId` updates; new ledger line.

6. **Reports**  
   - Type or chip a question → loading → typed answer; use **Auto-generate PO** / **Recipe substitution** for fake toasts.

---

## 11. Theming & layout

- **Default theme:** dark (`<html class="dark">` in `index.html`).  
- Fonts: **DM Sans**, **JetBrains Mono** (Google Fonts link in `index.html`).  
- Visual tokens: `index.css` (`@theme`, `.glass`, `.bg-grid`, `.ai-shimmer`).

---

## 12. Limitations (by design)

- No authentication, persistence, or server. Refresh resets to seeded data (except whatever you might add to `localStorage` later).  
- Copilot / NL / OCR are **rule-based mocks**, not real LLM or vision APIs.  
- One row per ingredient ID: transfers **move** the whole row to another location (no split qty across two locations).  
- Recipe deduct uses simplified math; not a full production yield engine.

---

## 13. Troubleshooting

| Issue | Check |
|--------|--------|
| `@/` imports fail | `vite.config.js` alias + restart dev server |
| Styles missing | `@tailwindcss/vite` in `vite.config.js`; `import './index.css'` in `main.jsx` |
| Blank Copilot on small screens | Use floating **Bot** button or go to `/copilot` |
| ESLint + `motion` | Code uses `import { motion as Motion }` and `<Motion.div />` |

---

## 14. License / usage

Private demo project (`"private": true` in `package.json`). Use internally or in pitch decks as agreed by your team.

---

*End of documentation.*
