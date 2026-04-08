import { motion as Motion } from 'framer-motion'

export function HealthScoreRing({ score = 82 }) {
  const r = 36
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg className="-rotate-90 transform" width="112" height="112">
        <circle cx="56" cy="56" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="none" />
        <Motion.circle
          cx="56"
          cy="56"
          r={r}
          stroke="url(#grad)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums text-white">{score}</span>
        <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-500">Health</span>
      </div>
    </div>
  )
}
