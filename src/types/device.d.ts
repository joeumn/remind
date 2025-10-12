// Device API types
interface DeviceAcceleration {
  x: number | null
  y: number | null
  z: number | null
}

interface DeviceMotionEvent extends Event {
  acceleration: DeviceAcceleration | null
  accelerationIncludingGravity: DeviceAcceleration | null
  rotationRate: DeviceRotationRate | null
  interval: number
}

interface DeviceRotationRate {
  alpha: number | null
  beta: number | null
  gamma: number | null
}

declare var DeviceMotionEvent: {
  prototype: DeviceMotionEvent
  new(): DeviceMotionEvent
}
