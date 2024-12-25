import type IBearingAndDistance from '../IBearingAndDistance'
import type IRoutePoint from '../IRoutePoint'

export default class RoutePoint_ implements IRoutePoint {
  name: string
  altitude: string
  latitude: string
  longitude: string

  latitudeDegrees: number
  longitudeDegrees: number

  bearingAndDistance: IBearingAndDistance | undefined

  constructor(name: string, altitude: string, latitude: string, longitude: string) {
    this.name = name
    this.altitude = altitude
    this.latitude = latitude
    this.longitude = longitude

    this.latitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(latitude))
    this.longitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(longitude))
  }

  private toNumber(prop: string): number {
    const noPostfix = prop.slice(0, -1)

    if (noPostfix.length == 9) {
      return +noPostfix
    } else if (noPostfix.length == 10) {
      return +noPostfix.substring(1)
    } else {
      throw new Error(`${prop} is in wrong format!`)
    }
  }

  private convertCoordinateToDegrees(coordinate: number): number {
    // Convert the number to a string to handle slicing
    const coordStr = coordinate.toFixed(2).padStart(8, '0') // Ensure fixed decimal format

    // Parse degrees, minutes, and seconds
    const degrees = parseInt(coordStr.slice(0, 2), 10) // First 2 digits are degrees
    const minutes = parseInt(coordStr.slice(2, 4), 10) // Next 2 digits are minutes
    const seconds = parseFloat(coordStr.slice(4)) // Remaining digits are seconds

    // Convert to decimal degrees
    return degrees + minutes / 60 + seconds / 3600
  }
}
