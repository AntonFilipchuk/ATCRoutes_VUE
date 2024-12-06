import { getRandomColor } from '@/utils/Modules/randomColorGenerator'
import type RoutePoint from './RoutePoint'

export default class Route {
  lineColor: string
  lineWidth: number
  pointColor: string
  pointWidth: number
  name: string
  points: RoutePoint[]
  isActive: boolean
  wasChanged: boolean = false

  constructor(
    name: string,
    points: RoutePoint[],
    lineWidth = 10,
    pointWidth = 10,
    isActive = false,
  ) {
    this.name = name
    this.points = points
    this.lineWidth = lineWidth
    this.pointWidth = pointWidth
    this.isActive = isActive

    const color = getRandomColor()
    this.lineColor = color
    this.pointColor = color
  }
}
