// Google Analytics gtag types
declare function gtag(
  command: 'config' | 'event' | 'js' | 'set',
  targetId: string,
  config?: Record<string, any>
): void

declare var gtag: typeof gtag
