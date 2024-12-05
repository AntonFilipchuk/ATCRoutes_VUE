import type ICartesianCoordinate from '../Interfaces/ICartesianCoordinate'
import type GeographicCoordinate from './GeographicCoordinate'

export default class Point implements ICartesianCoordinate {
  x: number
  y: number
  name: string
  geographicCoordinate: GeographicCoordinate

  constructor(x: number, y: number, geographicCoordinate: GeographicCoordinate) {
    this.x = x
    this.y = y
    this.name = geographicCoordinate.name
    this.geographicCoordinate = geographicCoordinate
  }
}
