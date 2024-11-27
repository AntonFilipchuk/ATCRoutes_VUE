import type AIPRoutePoint from './AIPRoutePoint'

export default class AIPRoute {
  name: string
  id: number
  points: AIPRoutePoint[]

  constructor(name: string, id: number, points: AIPRoutePoint[]) {
    this.name = name
    this.id = id
    this.points = points
  }
}
