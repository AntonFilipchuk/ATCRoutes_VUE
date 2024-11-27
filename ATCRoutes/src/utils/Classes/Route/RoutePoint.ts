export default class RoutePoint {
  z: number
  x: number
  y: number
  routeName: string
  name: string
  path2D: Path2D | undefined
  constructor(x: number, y: number, z: number, routeName: string, name: string) {
    this.x = x
    this.y = y
    this.z = z
    this.routeName = routeName
    this.name = name
  }
}
