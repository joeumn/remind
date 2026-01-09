// Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  grammars: SpeechGrammarList
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  start(): void
  stop(): void
  abort(): void
  onaudiostart: ((this: SpeechRecognition, ev: Event) => void) | null
  onaudioend: ((this: SpeechRecognition, ev: Event) => void) | null
  onend: ((this: SpeechRecognition, ev: Event) => void) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null
  onsoundstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onsoundend: ((this: SpeechRecognition, ev: Event) => void) | null
  onspeechstart: ((this: SpeechRecognition, ev: Event) => void) | null
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly confidence: number
  readonly transcript: string
}

interface SpeechGrammarList {
  readonly length: number
  item(index: number): SpeechGrammar
  [index: number]: SpeechGrammar
  addFromURI(src: string, weight?: number): void
  addFromString(string: string, weight?: number): void
}

interface SpeechGrammar {
  src: string
  weight: number
}

interface SpeechSynthesis extends EventTarget {
  pending: boolean
  speaking: boolean
  paused: boolean
  onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => void) | null
  speak(utterance: SpeechSynthesisUtterance): void
  cancel(): void
  pause(): void
  resume(): void
  getVoices(): SpeechSynthesisVoice[]
}

interface SpeechSynthesisUtterance extends EventTarget {
  text: string
  lang: string
  voice: SpeechSynthesisVoice | null
  volume: number
  rate: number
  pitch: number
  onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null
  onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null
}

interface SpeechSynthesisEvent extends Event {
  charIndex: number
  charLength: number
  elapsedTime: number
  name: string
}

interface SpeechSynthesisErrorEvent extends SpeechSynthesisEvent {
  error: string
}

interface SpeechSynthesisVoice {
  voiceURI: string
  name: string
  lang: string
  localService: boolean
  default: boolean
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

declare const webkitSpeechRecognition: {
  prototype: SpeechRecognition
  new(): SpeechRecognition
}

declare const SpeechSynthesis: {
  prototype: SpeechSynthesis
  new(): SpeechSynthesis
}

declare const webkitSpeechSynthesis: {
  prototype: SpeechSynthesis
  new(): SpeechSynthesis
}

declare const speechSynthesis: SpeechSynthesis

interface Window {
  SpeechRecognition: typeof SpeechRecognition
  webkitSpeechRecognition: typeof webkitSpeechRecognition
}
