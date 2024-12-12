import type IRouteVisuals from '@/utils/Interfaces/Visuals/IRouteVisuals'
import type Route from '../Route/Route'

export default class CanvasRoute {
  name: string
  routeVisuals: IRouteVisuals
  ifVisible = true
  ifRouteMagnetic = true
  routePointsAsPath2d: IRoutePointsAsPath2d[] = []
  route: Route

  constructor(route: Route, routeVisuals: IRouteVisuals) {
    this.name = route.name
    this.routeVisuals = routeVisuals
    this.route = route
  }
}

interface IRoutePointsAsPath2d {
  name: string
  path2d: Path2D
}
