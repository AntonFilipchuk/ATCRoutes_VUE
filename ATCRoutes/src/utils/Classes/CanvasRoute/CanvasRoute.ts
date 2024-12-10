import type Route from '../Route/Route'

export default class CanvasRoute {
  name: string
  lineColor = 'black'
  lineWidth = 10
  pointColor = 'black'
  pointWidth = 10

  ifRouteMagnetic = true
  ifVisible = true
  ifShowText = true

  routePointsAsPath2d: IRoutePointsAsPath2d[] = []
  route: Route

  constructor(route: Route) {
    this.name = route.name
    this.route = route
  }
}

interface IRoutePointsAsPath2d {
  name: string
  path2d: Path2D
}
