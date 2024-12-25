import type IRoutePointsAsPath2d from '../IRoutePointsAsPath2d'
import type IRouteVisuals from '../Visuals/IRouteVisuals'
import type ICanvasPoint from './ICanvasPoint'

export default interface ICanvasRoute {
  name: string
  routeVisuals: IRouteVisuals
  points: ICanvasPoint[]
  routePointsAsPath2d: IRoutePointsAsPath2d[]
}
