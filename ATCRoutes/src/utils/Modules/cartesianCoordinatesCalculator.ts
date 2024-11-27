import type IBearingAndDistance from '../Interfaces/IBearingAndDistance'
import type ICartesianCoordinates from '../Interfaces/ICartesianCoordinates'

export default function calculateCartesianCoordinate(
  bearingAndDistanceBetweenTwoCoordinates: IBearingAndDistance,
  useMagneticBearing: boolean,
  // xOffset: number,
  // yOffset: number,
): ICartesianCoordinates {
  let radians
  if (useMagneticBearing) {
    radians = (bearingAndDistanceBetweenTwoCoordinates.magneticBearing - 90) * (Math.PI / 180)
  } else {
    radians = (bearingAndDistanceBetweenTwoCoordinates.trueBearing - 90) * (Math.PI / 180)
  }

  const x = bearingAndDistanceBetweenTwoCoordinates.distance * Math.cos(radians)
  const y = bearingAndDistanceBetweenTwoCoordinates.distance * Math.sin(radians)

  return <ICartesianCoordinates>{ x: Math.round(x), y: Math.round(y) }
}
