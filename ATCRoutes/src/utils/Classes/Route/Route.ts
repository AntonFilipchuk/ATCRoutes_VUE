import { getRandomColor } from '@/utils/Modules/randomColorGenerator'
import type RoutePoint from './RoutePoint'

export default class Route {
  lineColor: string
  lineWidth: number
  pointColor: string
  pointWidth: number
  name: string
  private points: RoutePoint[] | undefined
  isActive: boolean
  ifRouteMagnetic = true
  wasChanged: boolean = false

  constructor(
    name: string,
    lineWidth = 10,
    pointWidth = 10,
    isActive = false,
    ifRouteMagnetic = true,
  ) {
    this.name = name
    this.lineWidth = lineWidth
    this.pointWidth = pointWidth
    this.isActive = isActive
    this.ifRouteMagnetic = ifRouteMagnetic

    const color = getRandomColor()
    this.lineColor = color
    this.pointColor = color
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
