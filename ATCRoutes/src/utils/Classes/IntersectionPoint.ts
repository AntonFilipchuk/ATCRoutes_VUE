import type Route from './Route/Route'
import type RoutePoint from './Route/RoutePoint'

export default class IntersectionPoint {
  x: number
  y: number
  z: number
  route1: Route
  route2: Route
  sectionRoute1: RoutePoint[]
  sectionRoute2: RoutePoint[]
  edgeCaseMessage: string | undefined
  message: string

  constructor(
    x: number,
    y: number,
    z: number,
    route1: Route,
    route2: Route,
    sectionRoute1: RoutePoint[],
    sectionRoute2: RoutePoint[],
  ) {
    this.x = x
    this.y = y
    this.z = z
    this.route1 = route1
    this.route2 = route2
    this.checkSection(sectionRoute1)
    this.checkSection(sectionRoute2)
    this.sectionRoute1 = sectionRoute1
    this.sectionRoute2 = sectionRoute2
    this.message = this.makeMessage()
  }

  private makeMessage() {
    return `Intersection between ${this.route1.name} and ${this.route2.name}. {${this.sectionRoute1[0].name}[${this.sectionRoute1[0].z}]-${this.sectionRoute1[1].name}[${this.sectionRoute1[1].z}]} - {${this.sectionRoute2[0].name}[${this.sectionRoute2[0].z}]-${this.sectionRoute2[1].name}[${this.sectionRoute2[1].z}]} at ${this.z}`
  }

  private checkSection(section: RoutePoint[]) {
    if (section.length !== 2) {
      throw new Error(`Intersection section doesn't contain 2 points!`)
    }
  }
}
