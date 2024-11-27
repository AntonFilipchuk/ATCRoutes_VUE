import type GeographicCoordinate from "../Classes/GeographicCoordinate"

export default interface IBearingAndDistance {
  originCoordinate: GeographicCoordinate
  coordinate: GeographicCoordinate
  trueBearing: number
  magneticBearing: number
  distance: number
}
