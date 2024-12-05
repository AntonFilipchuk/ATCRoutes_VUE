import type IBearingAndDistance from '../Interfaces/IBearingAndDistance'
import type ICartesianData from '../Interfaces/ICartesianData'

export default function calculateCartesianCoordinate(
  bearingAndDistanceBetweenTwoCoordinates: IBearingAndDistance,
): ICartesianData {
  const magneticRadians =
    (bearingAndDistanceBetweenTwoCoordinates.magneticBearing - 90) * (Math.PI / 180)
  const trueRadians = (bearingAndDistanceBetweenTwoCoordinates.trueBearing - 90) * (Math.PI / 180)

  const magneticCoordinates = {
    x: bearingAndDistanceBetweenTwoCoordinates.distance * Math.cos(magneticRadians),
    y: bearingAndDistanceBetweenTwoCoordinates.distance * Math.sin(magneticRadians),
    deviation: bearingAndDistanceBetweenTwoCoordinates.magneticDeviation,
  }

  const trueCoordinates = {
    x: bearingAndDistanceBetweenTwoCoordinates.distance * Math.cos(trueRadians),
    y: bearingAndDistanceBetweenTwoCoordinates.distance * Math.sin(trueRadians),
    deviation: 0,
  }

  return {
    magneticCartesianCoordinates: magneticCoordinates,
    trueCartesianCoordinates: trueCoordinates,
  }
}
