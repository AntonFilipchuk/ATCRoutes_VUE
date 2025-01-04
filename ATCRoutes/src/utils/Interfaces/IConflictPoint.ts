import type ICanvasRoute from './CanvasRoute/ICanvasRoute'

export default interface IConflictPoints {
  conflictPoints: IConflictPoint[]
  edgeCases: string[]
}

interface IConflictPoint {
  route1: ICanvasRoute
  route2: ICanvasRoute
  x: number
  y: number
  z: number
}
