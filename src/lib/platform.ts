/** The modifier key to show next to "K": ⌘ on Apple devices, Ctrl elsewhere. */
export function modifierLabel(): string {
  const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent)
  return isApple ? '⌘' : 'Ctrl'
}
