import type GeographicCoordinate from '../Classes/GeographicCoordinate'
import type IBearingAndDistance from '../Interfaces/IBearingAndDistance'

export default function calculateBearingAndDistance(
  originCoordinate: GeographicCoordinate,
  coordinate: GeographicCoordinate,
  magneticDeviation: number = 0,
): IBearingAndDistance {
  const lat1 = originCoordinate.latitudeDegrees
  const lon1 = originCoordinate.longitudeDegrees
  const lat2 = coordinate.latitudeDegrees
  const lon2 = coordinate.longitudeDegrees

  const R = 6371e3 // Earth's radius in meters

  // Convert latitude and longitude from degrees to radians
  const f1 = (lat1 * Math.PI) / 180
  const f2 = (lat2 * Math.PI) / 180
  const deltaF = ((lat2 - lat1) * Math.PI) / 180
  const deltaL = ((lon2 - lon1) * Math.PI) / 180

  // Haversine formula for distance
  const a =
    Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
    Math.cos(f1) * Math.cos(f2) * Math.sin(deltaL / 2) * Math.sin(deltaL / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  // Formula for initial true bearing
  const y = Math.sin(deltaL) * Math.cos(f2)
  const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(deltaL)
  const trueBearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360

  // Adjust bearing with magnetic deviation
  const magneticBearing = (trueBearing + magneticDeviation + 360) % 360

  return <IBearingAndDistance>{
    coordinate: coordinate,
    originCoordinate: originCoordinate,
    distance: distance,
    magneticBearing: magneticBearing,
    trueBearing: trueBearing,
    magneticDeviation: magneticDeviation,
  }
}
