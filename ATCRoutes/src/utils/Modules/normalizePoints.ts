import type Route from '../Classes/Route/Route'
import type ICartesianData from '../Interfaces/ICartesianData'
import type INormalizationParameters from '../Interfaces/INormalizationParameters'

export default function normalizeCartesianCoordinates(
  allRoutes: Route[],
  normalizationParameters: INormalizationParameters,
) {
  const routePoints = allRoutes.flatMap((route) => route.points)
  // Normalize points to fit into the canvas
  routePoints.forEach((point) => {
    const normalizedMagneticCoordinates = {
      x:
        point.cartesianData.magneticCartesianCoordinates.x / normalizationParameters.scaleMagnetic +
        normalizationParameters.width / 2,
      y:
        point.cartesianData.magneticCartesianCoordinates.y / normalizationParameters.scaleMagnetic +
        normalizationParameters.heigh / 2,
      deviation: point.cartesianData.magneticCartesianCoordinates.deviation,
    }

    const normalizedTrueCoordinates = {
      x:
        point.cartesianData.trueCartesianCoordinates.x / normalizationParameters.scaleTrue +
        normalizationParameters.width / 2,
      y:
        point.cartesianData.trueCartesianCoordinates.y / normalizationParameters.scaleTrue +
        normalizationParameters.heigh / 2,
      deviation: point.cartesianData.trueCartesianCoordinates.deviation,
    }

    const normalizeCartesianCoordinates: ICartesianData = {
      magneticCartesianCoordinates: normalizedMagneticCoordinates,
      trueCartesianCoordinates: normalizedTrueCoordinates,
    }
    point.setNormalizedCartesianCoordinates(normalizeCartesianCoordinates)
  })
}

export function calculateNormalizationParameters(
  allRoutes: Route[],
  canvasWidth: number,
  canvasHeight: number,
): INormalizationParameters {
  const allRoutesPoints = allRoutes.flatMap((route) => route.points)
  const maxXMagnetic = Math.max(
    ...allRoutesPoints.map((point) => Math.abs(point.cartesianData.magneticCartesianCoordinates.x)),
  )
  const maxYMagnetic = Math.max(
    ...allRoutesPoints.map((point) => Math.abs(point.cartesianData.magneticCartesianCoordinates.y)),
  )

  const maxXTrue = Math.max(
    ...allRoutesPoints.map((point) => Math.abs(point.cartesianData.trueCartesianCoordinates.x)),
  )
  const maxYTrue = Math.max(
    ...allRoutesPoints.map((point) => Math.abs(point.cartesianData.trueCartesianCoordinates.y)),
  )

  // Determine the scaling factor to fit within the canvas
  const scaleMagnetic = Math.max(
    maxXMagnetic / (canvasWidth - canvasWidth / 2),
    maxYMagnetic / (canvasHeight - canvasWidth / 2),
  )

  const scaleTrue = Math.max(
    maxXTrue / (canvasWidth - canvasWidth / 2),
    maxYTrue / (canvasHeight - canvasWidth / 2),
  )

  return {
    width: canvasWidth,
    heigh: canvasHeight,
    maxXMagnetic: maxXMagnetic,
    maxYMagnetic: maxYMagnetic,
    maxXTrue: maxXTrue,
    maxYTrue: maxYTrue,
    scaleMagnetic: scaleMagnetic,
    scaleTrue: scaleTrue,
  }
}

export function denormalizeCartesianCoordinates(
  normalizedX: number,
  normalizedY: number,
  normalizationParameters: INormalizationParameters,
): { x: number; y: number } {
  const x =
    (normalizedX - normalizationParameters.width / 2) * normalizationParameters.scaleMagnetic

  const y =
    (normalizedY - normalizationParameters.heigh / 2) * normalizationParameters.scaleMagnetic

  return { x, y }
}
