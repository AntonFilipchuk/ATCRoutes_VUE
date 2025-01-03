import convertToDMSFormat from '@/utils/Modules/convertToDMSFormat'
import type ICanvasPoint from './ICanvasPoint'

export default class CanvasPoint implements ICanvasPoint {
  name: string
  x: number
  y: number
  altitude: string
  latitude: string
  longitude: string

  constructor(
    name: string,
    x: number,
    y: number,
    altitude: string,
    latitude: string,
    longitude: string,
  ) {
    this.name = name
    this.x = x
    this.y = y
    this.altitude = altitude
    this.latitude = latitude
    this.longitude = longitude
  }

  public calculateNewGeographicCoordinates(coordinateDegrees: {
    latitudeDegrees: number
    longitudeDegrees: number
  }) {
    const converted = convertToDMSFormat({
      latitudeDegrees: coordinateDegrees.latitudeDegrees,
      longitudeDegrees: coordinateDegrees.longitudeDegrees,
    })

    this.latitude = converted.latitude
    this.longitude = converted.longitude
  }
}
