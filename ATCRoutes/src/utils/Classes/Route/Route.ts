import type RoutePoint from './RoutePoint'

export default class Route {
  color: string
  lineWidth: number
  pointWidth: number
  name: string
  points: RoutePoint[]
  isActive: boolean

  constructor(
    name: string,
    points: RoutePoint[],
    color = 'black',
    lineWidth = 10,
    pointWidth = 10,
    isActive = false,
  ) {
    this.name = name
    this.points = points
    this.color = color
    this.lineWidth = lineWidth
    this.pointWidth = pointWidth
    this.isActive = isActive
  }
}
