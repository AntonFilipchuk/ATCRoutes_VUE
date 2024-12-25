import type IRoutePoint from './IRoutePoint'
import type IRouteVisuals from './Visuals/IRouteVisuals'

export default interface IRoute {
  id: string
  name: string
  visuals: IRouteVisuals
  runway?: string | undefined
  points: IRoutePoint[]
}