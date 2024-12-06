import type GeographicCoordinate from '../Classes/GeographicCoordinate'
import type ICartesianCoordinate from '../Interfaces/ICartesianCoordinate'
import type IGeographicCoordinate from '../Interfaces/IGeographicCoordinate'

export default function convertCartesianToGeographic(
  cartesianCoordinates: ICartesianCoordinate,
  originCoordinate: GeographicCoordinate,
  coordinateName: string,
): IGeographicCoordinate {
  // Convert x, y back into distance and bearing
  const distance = Math.sqrt(
    cartesianCoordinates.x * cartesianCoordinates.x +
      cartesianCoordinates.y * cartesianCoordinates.y,
  )

  const radians = Math.atan2(cartesianCoordinates.y, cartesianCoordinates.x)
  let bearing = (radians * (180 / Math.PI) + 90 + 360) % 360 // Adjust from Cartesian to geographic bearing

  bearing = (bearing - cartesianCoordinates.deviation + 360) % 360

  // Convert bearing to radians for geographic calculations
  const bearingRadians = (bearing * Math.PI) / 180

  // Convert origin latitude and longitude to radians
  const lat1 = (originCoordinate.latitudeDegrees * Math.PI) / 180
  const lon1 = (originCoordinate.longitudeDegrees * Math.PI) / 180

  // Earth's radius in meters
  const R = 6371e3

  // Calculate new latitude using the haversine formula
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRadians),
  )

  // Calculate new longitude
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRadians) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2),
    )

  // Convert results back to degrees
  const latitudeDegrees = (lat2 * 180) / Math.PI
  const longitudeDegrees = (lon2 * 180) / Math.PI

  const coordinate = {
    latitudeDegrees: latitudeDegrees,
    longitudeDegrees: longitudeDegrees,
    name: coordinateName,
  }

  return coordinate
}
