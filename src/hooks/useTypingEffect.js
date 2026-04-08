import { useState, useEffect } from 'react'

export function useTypingEffect(text, speed = 18, enabled = true) {
  const [out, setOut] = useState(enabled ? '' : text)

  useEffect(() => {
    if (!enabled) {
      queueMicrotask(() => setOut(text))
      return
    }
    queueMicrotask(() => setOut(''))
    let i = 0
    const id = setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed, enabled])

  return out
}
