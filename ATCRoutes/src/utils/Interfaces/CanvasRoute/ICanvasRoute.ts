import type IRoute from '../IRoute'
import type IRoutePointsAsPath2d from '../IRoutePointsAsPath2d'
import type IRouteVisuals from '../Visuals/IRouteVisuals'
import type CanvasPoint from './CanvasPoint'


export default interface ICanvasRoute extends IRoute {
  id: string
  aerodromeId: string
  aerodromeName: string
  type: string
  standardRouteId?: string
  name: string
  ifStandard: boolean
  visuals: IRouteVisuals
  points: CanvasPoint[]
  routePointsAsPath2d: IRoutePointsAsPath2d[]
}
