import type IRouteVisuals from '@/utils/Interfaces/Visuals/IRouteVisuals'
import type Route from '../Route/Route'
import type IRoutePointsAsPath2d from '@/utils/Interfaces/IRoutePointsAsPath2d'

export default class CanvasRoute {
  name: string
  route: Route
  routeVisuals: IRouteVisuals
  ifRouteMagnetic = true
  routePointsAsPath2d: IRoutePointsAsPath2d[] = []

  constructor(route: Route, routeVisuals: IRouteVisuals) {
    this.name = route.name
    this.routeVisuals = routeVisuals
    this.route = route
  }
}

