// Google Analytics gtag types
declare function gtag(
  command: 'config' | 'event' | 'js' | 'set',
  targetId: string,
  config?: Record<string, unknown>
): void

declare const gtag: typeof gtag
