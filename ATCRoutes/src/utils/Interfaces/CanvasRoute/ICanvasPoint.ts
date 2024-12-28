import type IRoutePoint from '../IRoutePoint'

export default interface ICanvasPoint extends IRoutePoint {
  name: string
  x: number
  y: number
  altitude: string
}
