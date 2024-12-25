import type IGeographicCoordinate from '../Interfaces/IGeographicCoordinate'
import convertToDMSFormat from '../Modules/convertToDMSFormat'

export default class GeographicCoordinate implements IGeographicCoordinate {
  name: string
  private latitude: string | undefined = undefined
  private longitude: string | undefined = undefined
  latitudeDegrees: number
  longitudeDegrees: number

  constructor(name: string, latitude: string, longitude: string) {
    this.name = name
    this.latitude = latitude
    this.longitude = longitude
    try {
      this.latitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(latitude))
      this.longitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(longitude))
    } catch (error) {
      console.error(error)
      this.latitudeDegrees = 0
      this.longitudeDegrees = 0
    }
  }

  public getLatLonDMS(): {
    longitude: string
    latitude: string
  } {
    if (!this.latitude || !this.longitude) {
      return convertToDMSFormat({
        longitudeDegrees: this.longitudeDegrees,
        latitudeDegrees: this.latitudeDegrees,
      })
    }

    return {
      longitude: this.longitude,
      latitude: this.latitude,
    }
  }

  //"553642.44N", "0371636.78E"
  //553642.44, 371636.78
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
