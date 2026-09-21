import { useEffect } from 'react'

/** Calls `toggle` on Ctrl+K or Cmd+K. Pass enabled=false while another dialog owns the keyboard. */
export function useCommandShortcut(toggle: () => void, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle, enabled])
}
