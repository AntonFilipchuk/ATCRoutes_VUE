import type GeographicCoordinate from './GeographicCoordinate'

export default class Point {
  x: number
  y: number
  name: string
  geographicOrigin: GeographicCoordinate

  constructor(x: number, y: number, geographicOrigin: GeographicCoordinate) {
    this.x = x
    this.y = y
    this.name = geographicOrigin.name
    this.geographicOrigin = geographicOrigin
  }
}
