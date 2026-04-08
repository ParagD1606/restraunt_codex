/** Realistic hospitality inventory mock */

export const locations = [
  { id: 'loc-main', name: 'Main Kitchen', code: 'MK' },
  { id: 'loc-bar', name: 'Bar & Lounge', code: 'BR' },
  { id: 'loc-pastry', name: 'Pastry Lab', code: 'PL' },
  { id: 'loc-events', name: 'Events Prep', code: 'EV' },
]

export const vendors = [
  { id: 'v1', name: 'Sysco Metro', leadDays: 2, rating: 4.7 },
  { id: 'v2', name: 'Local Farm Co-op', leadDays: 1, rating: 4.9 },
  { id: 'v3', name: 'Coastal Seafood', leadDays: 1, rating: 4.5 },
  { id: 'v4', name: 'Artisan Bakery Supply', leadDays: 3, rating: 4.6 },
]

export const ingredients = [
  {
    id: 'ing-1',
    sku: 'PRT-OLV-01',
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    unit: 'L',
    par: 24,
    qty: 18,
    costPerUnit: 12.5,
    locationId: 'loc-main',
    vendorId: 'v1',
    shelfLifeDays: 180,
    lastCounted: '2026-04-02',
  },
  {
    id: 'ing-2',
    sku: 'DRY-ARB-02',
    name: 'Arborio Rice',
    category: 'Dry Goods',
    unit: 'kg',
    par: 40,
    qty: 22,
    costPerUnit: 3.2,
    locationId: 'loc-main',
    vendorId: 'v1',
    shelfLifeDays: 365,
    lastCounted: '2026-04-01',
  },
  {
    id: 'ing-3',
    sku: 'DAI-BUT-01',
    name: 'European Butter',
    category: 'Dairy',
    unit: 'kg',
    par: 15,
    qty: 6,
    costPerUnit: 14.8,
    locationId: 'loc-main',
    vendorId: 'v1',
    shelfLifeDays: 45,
    lastCounted: '2026-04-04',
  },
  {
    id: 'ing-4',
    sku: 'PRT-TRF-01',
    name: 'Black Truffle Paste',
    category: 'Pantry',
    unit: 'jar',
    par: 8,
    qty: 3,
    costPerUnit: 48,
    locationId: 'loc-main',
    vendorId: 'v4',
    shelfLifeDays: 90,
    lastCounted: '2026-03-28',
  },
  {
    id: 'ing-5',
    sku: 'SEA-SLM-01',
    name: 'Atlantic Salmon Fillet',
    category: 'Protein',
    unit: 'kg',
    par: 35,
    qty: 12,
    costPerUnit: 28.5,
    locationId: 'loc-main',
    vendorId: 'v3',
    shelfLifeDays: 4,
    lastCounted: '2026-04-05',
  },
  {
    id: 'ing-6',
    sku: 'VEG-ASP-01',
    name: 'Jumbo Asparagus',
    category: 'Produce',
    unit: 'bunch',
    par: 30,
    qty: 8,
    costPerUnit: 4.2,
    locationId: 'loc-main',
    vendorId: 'v2',
    shelfLifeDays: 5,
    lastCounted: '2026-04-05',
  },
  {
    id: 'ing-7',
    sku: 'BAR-GIN-01',
    name: 'London Dry Gin',
    category: 'Spirits',
    unit: 'bottle',
    par: 24,
    qty: 31,
    costPerUnit: 22,
    locationId: 'loc-bar',
    vendorId: 'v1',
    shelfLifeDays: 9999,
    lastCounted: '2026-04-03',
  },
  {
    id: 'ing-8',
    sku: 'BAR-VER-01',
    name: 'Sweet Vermouth',
    category: 'Spirits',
    unit: 'bottle',
    par: 12,
    qty: 4,
    costPerUnit: 18,
    locationId: 'loc-bar',
    vendorId: 'v1',
    shelfLifeDays: 730,
    lastCounted: '2026-03-30',
  },
  {
    id: 'ing-9',
    sku: 'PST-CHOC-01',
    name: 'Valrhona Dark 70%',
    category: 'Pastry',
    unit: 'kg',
    par: 20,
    qty: 14,
    costPerUnit: 32,
    locationId: 'loc-pastry',
    vendorId: 'v4',
    shelfLifeDays: 540,
    lastCounted: '2026-04-04',
  },
  {
    id: 'ing-10',
    sku: 'PST-CRM-01',
    name: 'Heavy Cream 36%',
    category: 'Dairy',
    unit: 'L',
    par: 40,
    qty: 11,
    costPerUnit: 3.8,
    locationId: 'loc-pastry',
    vendorId: 'v1',
    shelfLifeDays: 10,
    lastCounted: '2026-04-05',
  },
]

export const recipes = [
  {
    id: 'rec-1',
    name: 'Risotto ai Funghi',
    coverColor: 'from-violet-500/20 to-fuchsia-500/10',
    servingsPerBatch: 8,
    ingredients: [
      { ingredientId: 'ing-2', qty: 0.8, unit: 'kg' },
      { ingredientId: 'ing-1', qty: 0.15, unit: 'L' },
      { ingredientId: 'ing-3', qty: 0.4, unit: 'kg' },
    ],
  },
  {
    id: 'rec-2',
    name: 'Salmon Niçoise (Plated)',
    coverColor: 'from-emerald-500/20 to-cyan-500/10',
    servingsPerBatch: 12,
    ingredients: [
      { ingredientId: 'ing-5', qty: 2.4, unit: 'kg' },
      { ingredientId: 'ing-6', qty: 6, unit: 'bunch' },
      { ingredientId: 'ing-1', qty: 0.05, unit: 'L' },
    ],
  },
  {
    id: 'rec-3',
    name: 'Truffle Cappelletti',
    coverColor: 'from-amber-500/20 to-orange-500/10',
    servingsPerBatch: 24,
    ingredients: [
      { ingredientId: 'ing-4', qty: 2, unit: 'jar' },
      { ingredientId: 'ing-3', qty: 0.6, unit: 'kg' },
      { ingredientId: 'ing-2', qty: 0.5, unit: 'kg' },
    ],
  },
  {
    id: 'rec-4',
    name: 'Dark Chocolate Soufflé',
    coverColor: 'from-rose-500/20 to-violet-500/10',
    servingsPerBatch: 10,
    ingredients: [
      { ingredientId: 'ing-9', qty: 1.2, unit: 'kg' },
      { ingredientId: 'ing-10', qty: 1.5, unit: 'L' },
      { ingredientId: 'ing-3', qty: 0.35, unit: 'kg' },
    ],
  },
]

export const stockHistory = [
  { date: 'Mar 30', value: 84200 },
  { date: 'Mar 31', value: 83800 },
  { date: 'Apr 1', value: 85100 },
  { date: 'Apr 2', value: 84750 },
  { date: 'Apr 3', value: 86200 },
  { date: 'Apr 4', value: 87800 },
  { date: 'Apr 5', value: 88420 },
]

export const costTrend = [
  { week: 'W1', food: 28.2, bev: 18.4 },
  { week: 'W2', food: 29.1, bev: 19.0 },
  { week: 'W3', food: 30.4, bev: 18.8 },
  { week: 'W4', food: 31.2, bev: 19.2 },
]

export const riskHeatmap = [
  { location: 'Main Kitchen', mon: 0.2, tue: 0.35, wed: 0.55, thu: 0.72, fri: 0.88, sat: 0.65, sun: 0.4 },
  { location: 'Bar', mon: 0.15, tue: 0.22, wed: 0.3, thu: 0.42, fri: 0.78, sat: 0.9, sun: 0.35 },
  { location: 'Pastry', mon: 0.4, tue: 0.45, wed: 0.5, thu: 0.48, fri: 0.52, sat: 0.7, sun: 0.55 },
  { location: 'Events', mon: 0.1, tue: 0.12, wed: 0.25, thu: 0.6, fri: 0.85, sat: 0.95, sun: 0.2 },
]

export const aiInsights = [
  {
    id: 'ins-1',
    title: 'Butter burn rate ↑ 18%',
    body: 'Brunch service drove compound butter pulls. Consider a standing PO with Sysco for Fri–Sun.',
    severity: 'warn',
    metric: '+18%',
  },
  {
    id: 'ins-2',
    title: 'Vermouth below par at Bar',
    body: 'Negroni week promo not synced with pars. Auto-PO draft ready.',
    severity: 'critical',
    metric: '−67%',
  },
  {
    id: 'ins-3',
    title: 'Weather tailwind on asparagus',
    body: 'Local temps up 6°F — patio covers forecast +14% veg sides. Stock asparagus +2 days cover.',
    severity: 'info',
    metric: '+14%',
  },
]

export const initialWasteLogs = [
  {
    id: 'w-1',
    at: '2026-04-05T09:12:00',
    ingredientId: 'ing-6',
    qty: 4,
    unit: 'bunch',
    reason: 'Spoilage',
    aiSuggested: true,
    staff: 'M. Chen',
  },
  {
    id: 'w-2',
    at: '2026-04-04T16:40:00',
    ingredientId: 'ing-5',
    qty: 1.2,
    unit: 'kg',
    reason: 'Prep error — over-portion',
    aiSuggested: true,
    staff: 'J. Ortiz',
  },
]

export const timelineEvents = [
  { id: 't1', at: '2026-04-05 06:12', type: 'receive', label: 'Invoice #8842 matched (Sysco)', delta: '+$4,280' },
  { id: 't2', at: '2026-04-05 07:45', type: 'count', label: 'Cycle count — Bar spirits', delta: 'Δ −2 bottles' },
  { id: 't3', at: '2026-04-05 11:02', type: 'recipe', label: 'Risotto batch ×3 posted', delta: '−8.4 kg rice' },
  { id: 't4', at: '2026-04-05 14:18', type: 'waste', label: 'Asparagus spoilage', delta: '−4 bunch' },
  { id: 't5', at: '2026-04-05 15:55', type: 'transfer', name: 'Cream → Events', delta: '6 L' },
]

/** Simulated OCR / invoice lines after "AI parse" */
export const mockInvoiceLines = [
  {
    id: 'line-1',
    raw: 'EVOO 4/5L CS',
    extractedQty: 20,
    extractedUnit: 'L',
    matchedIngredientId: 'ing-1',
    confidence: 0.94,
    unitPrice: 11.9,
  },
  {
    id: 'line-2',
    raw: 'ARB RICE 20KG',
    extractedQty: 20,
    extractedUnit: 'kg',
    matchedIngredientId: 'ing-2',
    confidence: 0.88,
    unitPrice: 3.05,
  },
  {
    id: 'line-3',
    raw: 'BTR UNSLT EU 5KG',
    extractedQty: 10,
    extractedUnit: 'kg',
    matchedIngredientId: 'ing-3',
    confidence: 0.72,
    unitPrice: 15.2,
  },
  {
    id: 'line-4',
    raw: 'MISC ITEM — GREEN TUB',
    extractedQty: 2,
    extractedUnit: 'ea',
    matchedIngredientId: null,
    confidence: 0.31,
    unitPrice: 0,
  },
]

export const sopChecklist = [
  { id: 's1', task: 'Verify cold chain temps on seafood delivery', done: true },
  { id: 's2', task: 'Cross-dock high-turn produce to line coolers', done: true },
  { id: 's3', task: 'Photo-archive invoice anomalies for Copilot learning', done: false },
  { id: 's4', task: 'Release holding PO if butter < 8 kg', done: false },
]

export const shortagePredictions = [
  { ingredientId: 'ing-3', etaHours: 18, confidence: 0.91, driver: 'Brunch + pastry overlap' },
  { ingredientId: 'ing-8', etaHours: 42, confidence: 0.76, driver: 'Bar promo not in pars' },
  { ingredientId: 'ing-6', etaHours: 28, confidence: 0.84, driver: 'Weather-adjusted demand' },
]

export const anomalyAlerts = [
  { id: 'a1', text: 'Salmon variance vs POS depletion: 8.4% — investigate portioning', level: 'high' },
  { id: 'a2', text: 'Gin inventory rose while sales flat — possible mis-count', level: 'med' },
]

export const nlQueryResponses = {
  default:
    'I compared depletions, waste, and price movement for the last 7 days. Food cost is elevated primarily from protein price creep (+$1.8k) and butter over-pull during brunch (+$640). I can draft vendor counter-offers or adjust pars — which do you want?',
  foodcost:
    'Food cost is up **1.0 pts WoW**. Drivers: butter burn, salmon price, and a spike in asparagus waste tied to warmer patio traffic. Recommended: tighten salmon par by 6% and enable weather-aware veg cover.',
  waste: 'Waste is **0.4 pts** above your trailing 4-week median. Top SKU: asparagus (spoilage). Suggest FIFO stickers + smaller standing order from Local Farm Co-op.',
}
