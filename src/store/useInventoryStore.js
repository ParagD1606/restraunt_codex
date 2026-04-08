import { create } from 'zustand'
import {
  ingredients as seedIngredients,
  initialWasteLogs,
  mockInvoiceLines,
  nlQueryResponses,
  recipes,
  timelineEvents as seedTimeline,
} from '@/data/mockData'

let notifId = 0

function pushNotif(get, set, payload) {
  const id = `n-${++notifId}`
  const n = { id, ...payload, at: Date.now() }
  set((s) => ({ notifications: [n, ...s.notifications].slice(0, 12) }))
  setTimeout(() => {
    set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) }))
  }, 5200)
}

const clone = (x) => JSON.parse(JSON.stringify(x))

export const useInventoryStore = create((set, get) => ({
  ingredients: clone(seedIngredients),
  wasteLogs: clone(initialWasteLogs),
  timeline: clone(seedTimeline),

  receivingStep: 'upload', // upload | parsing | review | done
  parsedLines: [],
  receivingApproved: false,

  countSession: {
    active: false,
    index: 0,
    scanned: [],
    values: {},
  },

  copilotOpen: true,
  copilotMessages: [
    {
      id: 'm0',
      role: 'assistant',
      text: "I'm your Inventory Copilot. Ask about variances, shortages, or say **fix inventory** for one-click suggestions.",
    },
  ],

  commandOpen: false,
  notifications: [],

  transfers: [
    { id: 'tr-1', from: 'loc-pastry', to: 'loc-events', ingredientId: 'ing-10', qty: 6, unit: 'L', status: 'pending' },
  ],

  uiLoading: false,
  skeletonDemo: false,

  setCommandOpen: (v) => set({ commandOpen: v }),
  setCopilotOpen: (v) => set({ copilotOpen: v }),
  setUiLoading: (v) => set({ uiLoading: v }),
  setSkeletonDemo: (v) => set({ skeletonDemo: v }),

  /** Receiving flow */
  startParseInvoice: () => {
    set({ receivingStep: 'parsing', uiLoading: true })
    setTimeout(() => {
      set({
        receivingStep: 'review',
        parsedLines: clone(mockInvoiceLines),
        uiLoading: false,
      })
      pushNotif(get, set, {
        type: 'success',
        title: 'Invoice parsed',
        body: '4 line items extracted — 1 needs review',
      })
    }, 1400)
  },

  approveReceiving: () => {
    const lines = get().parsedLines
    set((s) => {
      const next = s.ingredients.map((ing) => {
        const match = lines.find((l) => l.matchedIngredientId === ing.id)
        if (!match) return ing
        const add =
          match.extractedUnit === ing.unit
            ? match.extractedQty
            : match.extractedQty * 0.2
        return { ...ing, qty: Math.round((ing.qty + add) * 10) / 10 }
      })
      return {
        ingredients: next,
        receivingStep: 'done',
        receivingApproved: true,
        timeline: [
          {
            id: `t-${Date.now()}`,
            at: new Date().toISOString().slice(0, 16).replace('T', ' '),
            type: 'receive',
            label: 'Invoice approved — stock updated',
            delta: `+${lines.filter((l) => l.matchedIngredientId).length} SKUs`,
          },
          ...s.timeline,
        ],
      }
    })
    pushNotif(get, set, {
      type: 'success',
      title: 'Stock received',
      body: 'On-hand quantities updated from matched lines',
    })
  },

  resetReceiving: () =>
    set({
      receivingStep: 'upload',
      parsedLines: [],
      receivingApproved: false,
    }),

  updateParsedLine: (lineId, patch) =>
    set((s) => ({
      parsedLines: s.parsedLines.map((l) => (l.id === lineId ? { ...l, ...patch } : l)),
    })),

  /** Stock count */
  startCountSession: () =>
    set({
      countSession: { active: true, index: 0, scanned: [], values: {} },
    }),
  setCountValue: (ingredientId, val) =>
    set((s) => ({
      countSession: {
        ...s.countSession,
        values: { ...s.countSession.values, [ingredientId]: val },
      },
    })),
  scanBarcode: (ingredientId) =>
    set((s) => {
      if (s.countSession.scanned.includes(ingredientId)) return s
      return {
        countSession: {
          ...s.countSession,
          scanned: [...s.countSession.scanned, ingredientId],
        },
      }
    }),
  nextCountItem: () =>
    set((s) => ({
      countSession: {
        ...s.countSession,
        index: s.countSession.index + 1,
      },
    })),

  /** Waste */
  addWaste: (payload) => {
    const id = `w-${Date.now()}`
    set((s) => ({
      wasteLogs: [
        {
          id,
          at: new Date().toISOString(),
          ...payload,
          aiSuggested: true,
          staff: 'You',
        },
        ...s.wasteLogs,
      ],
      ingredients: s.ingredients.map((ing) =>
        ing.id === payload.ingredientId
          ? { ...ing, qty: Math.max(0, ing.qty - payload.qty) }
          : ing
      ),
      timeline: [
        {
          id: `t-${Date.now()}`,
          at: new Date().toISOString().slice(0, 16).replace('T', ' '),
          type: 'waste',
          label: `Waste logged — ${payload.reason}`,
          delta: `−${payload.qty} ${payload.unit}`,
        },
        ...s.timeline,
      ],
    }))
    pushNotif(get, set, { type: 'info', title: 'Waste captured', body: 'Variance watch updated' })
  },

  /** Recipe deduct (demo) */
  deductRecipe: (recipeId, batches = 1) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (!recipe) return
    set((s) => {
      let ings = s.ingredients
      for (const li of recipe.ingredients) {
        const need = li.qty * batches
        ings = ings.map((ing) =>
          ing.id === li.ingredientId
            ? { ...ing, qty: Math.max(0, Math.round((ing.qty - need) * 100) / 100) }
            : ing
        )
      }
      return {
        ingredients: ings,
        timeline: [
          {
            id: `t-${Date.now()}`,
            at: new Date().toISOString().slice(0, 16).replace('T', ' '),
            type: 'recipe',
            label: `${recipe.name} ×${batches}`,
            delta: 'Ingredients deducted',
          },
          ...s.timeline,
        ],
      }
    })
    pushNotif(get, set, { type: 'success', title: 'Consumption posted', body: recipe.name })
  },

  /** Transfers */
  completeTransfer: (transferId) =>
    set((s) => ({
      transfers: s.transfers.map((t) =>
        t.id === transferId ? { ...t, status: 'completed' } : t
      ),
    })),
  moveTransferIngredient: (ingredientId, fromLoc, toLoc) => {
    set((s) => {
      const moved = s.ingredients.find((i) => i.id === ingredientId && i.locationId === fromLoc)
      const qty = moved?.qty ?? 0
      const unit = moved?.unit ?? 'ea'
      return {
        ingredients: s.ingredients.map((ing) =>
          ing.id === ingredientId && ing.locationId === fromLoc ? { ...ing, locationId: toLoc } : ing
        ),
        transfers: [
          ...s.transfers,
          {
            id: `tr-${Date.now()}`,
            from: fromLoc,
            to: toLoc,
            ingredientId,
            qty,
            unit,
            status: 'completed',
          },
        ],
        timeline: [
          {
            id: `t-${Date.now()}`,
            at: new Date().toISOString().slice(0, 16).replace('T', ' '),
            type: 'transfer',
            label: `Transfer ${ingredientId.slice(0, 6)}…`,
            delta: `${qty} ${unit} moved`,
          },
          ...s.timeline,
        ],
      }
    })
    pushNotif(get, set, { type: 'success', title: 'Transfer complete', body: 'Locations updated' })
  },

  /** Copilot */
  sendCopilotMessage: (text) => {
    const userMsg = { id: `u-${Date.now()}`, role: 'user', text }
    set((s) => ({
      copilotMessages: [...s.copilotMessages, userMsg],
    }))
    const lower = text.toLowerCase()
    let reply =
      'I can help with pars, transfers, or explain variances. Try asking about **food cost** or type **fix inventory**.'
    if (lower.includes('food cost') || lower.includes('why is food')) {
      reply = nlQueryResponses.foodcost
    } else if (lower.includes('waste')) {
      reply = nlQueryResponses.waste
    } else if (lower.includes('fix inventory')) {
      reply =
        '**Fix Inventory** plan: (1) Approve draft PO for vermouth + butter. (2) FIFO asparagus to line. (3) Reconcile gin count at Bar. Say **apply** to simulate.'
    } else if (lower.includes('shortage') || lower.includes('tomorrow')) {
      reply =
        'Predicted shortages in the next 48h: **Butter** (91% conf), **Asparagus** (84%), **Vermouth** (76%). Want me to auto-generate POs?'
    }
    setTimeout(() => {
      set((s) => ({
        copilotMessages: [
          ...s.copilotMessages,
          { id: `a-${Date.now()}`, role: 'assistant', text: reply },
        ],
      }))
    }, 600)
  },

  /** Health score derived in UI; store could hold manual overrides */
  addNotification: (payload) => pushNotif(get, set, payload),
}))
