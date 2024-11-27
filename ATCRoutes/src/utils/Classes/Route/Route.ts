import type RoutePoint from './RoutePoint'

export default class Route {
  color: string
  name: string
  points: RoutePoint[]

  constructor(name: string, points: RoutePoint[], color = 'black') {
    this.name = name
    this.points = points
    this.color = color
  }
}
