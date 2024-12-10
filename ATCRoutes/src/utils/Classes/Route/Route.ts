import type RoutePoint from './RoutePoint'

export default class Route {
  name: string
  private points: RoutePoint[] | undefined
  ifRouteMagnetic = true

  constructor(name: string, ifRouteMagnetic = true) {
    this.name = name
    this.ifRouteMagnetic = ifRouteMagnetic
  }

  getPoints() {
    if (!this.points) {
      throw new Error(`${this.name} route doesn't have any points! Impossible!`)
    }
    return this.points
  }

  setPoints(points: RoutePoint[]) {
    this.points = points
  }
}
