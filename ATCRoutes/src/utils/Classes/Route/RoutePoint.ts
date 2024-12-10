import type IGeographicCoordinate from '@/utils/Interfaces/IGeographicCoordinate'
import type Route from './Route'
import type IBearingAndDistance from '@/utils/Interfaces/IBearingAndDistance'
import type ICartesianData from '@/utils/Interfaces/ICartesianData'

export default class RoutePoint {
  name: string
  cartesianData: ICartesianData
  normalizedCartesianData: ICartesianData | undefined
  z: number
  route: Route
  geographicCoordinate: IGeographicCoordinate | undefined
  bearingAndDistance: IBearingAndDistance
  wasChanged: boolean = false

  constructor(
    name: string,
    z: number,
    geographicCoordinate: IGeographicCoordinate,
    bearingAndDistance: IBearingAndDistance,
    cartesianData: ICartesianData,
    route: Route,
  ) {
    this.name = name
    this.z = z
    this.geographicCoordinate = geographicCoordinate
    this.bearingAndDistance = bearingAndDistance
    this.cartesianData = cartesianData
    this.route = route
  }

  setNormalizedCartesianData(normalizedCartesianData: ICartesianData) {
    this.normalizedCartesianData = normalizedCartesianData
  }

  getNormalizedCartesianCoordinates() {
    if (!this.normalizedCartesianData) {
      throw new Error(`${this.name} point doesn't have normalized cartesian data!`)
    }

    if (this.route.ifRouteMagnetic) {
      return this.normalizedCartesianData.magneticCartesianCoordinates
    }
    return this.normalizedCartesianData.trueCartesianCoordinates
  }
}
