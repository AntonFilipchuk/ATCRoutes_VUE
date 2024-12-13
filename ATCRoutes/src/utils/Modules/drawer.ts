import type CanvasRoute from '../Classes/CanvasRoute/CanvasRoute'
import type RoutePoint from '../Classes/Route/RoutePoint'
import type ITextVisual from '../Interfaces/Visuals/ITextVisual'
import type IVisual from '../Interfaces/Visuals/IVisual'

export function drawCanvasRoutePoints(
  canvasRoute: CanvasRoute,
  canvasContext: CanvasRenderingContext2D,
) {
  const pointsVisuals = canvasRoute.routeVisuals.pointVisuals
  const points = canvasRoute.route.getPoints()
  points.forEach((point) => {
    canvasRoute.routePointsAsPath2d.push({
      name: point.name,
      path2d: drawRoutePoint(point, pointsVisuals, canvasContext),
    })
  })
}

export function drawRoutePoint(
  point: RoutePoint,
  visuals: IVisual,
  canvasContext: CanvasRenderingContext2D,
): Path2D {
  const path = new Path2D()
  const x = point.getNormalizedCartesianCoordinates().x
  const y = point.getNormalizedCartesianCoordinates().y
  path.rect(x - visuals.width / 2, y - visuals.width / 2, visuals.width, visuals.width)

  canvasContext.fillStyle = visuals.color
  canvasContext.fill(path)

  if (visuals.ifStroke) {
    canvasContext.strokeStyle = visuals.strokeColor
    canvasContext.lineWidth = visuals.strokeWidth
    canvasContext.stroke(path)
  }

  return path
}

export default function drawCanvasRouteLines(
  canvasRoute: CanvasRoute,
  canvasContext: CanvasRenderingContext2D,
) {
  const visuals = canvasRoute.routeVisuals.lineVisuals

  const linePath = new Path2D()

  const points = canvasRoute.route.getPoints()

  points.forEach((point, index) => {
    const x = point.getNormalizedCartesianCoordinates().x
    const y = point.getNormalizedCartesianCoordinates().y
    if (index === 0) {
      linePath.moveTo(x, y)
    } else {
      linePath.lineTo(x, y)
    }
  })

  if (visuals.ifStroke) {
    canvasContext.strokeStyle = visuals.strokeColor
    canvasContext.lineWidth = visuals.strokeWidth + visuals.width
    canvasContext.stroke(linePath)
  }

  canvasContext.strokeStyle = visuals.color
  canvasContext.lineWidth = visuals.width
  canvasContext.stroke(linePath)
}

export function cleanCanvas(canvasContext: CanvasRenderingContext2D) {
  canvasContext.clearRect(0, 0, 10000000, 10000000)
}

export function DrawCanvasRouteText(
  canvasRoute: CanvasRoute,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasRoute.route
    .getPoints()
    .forEach((point) => drawText(point, canvasRoute.routeVisuals.textVisuals, canvasContext))
}

export function drawText(
  routePoint: RoutePoint,
  textVisuals: ITextVisual,
  canvasContext: CanvasRenderingContext2D,
) {
  const font = textVisuals.font.toLowerCase()
  const fontSize = textVisuals.width
  const x = routePoint.getNormalizedCartesianCoordinates().x + textVisuals.xOffset
  const y = routePoint.getNormalizedCartesianCoordinates().y + textVisuals.yOffset

  canvasContext.miterLimit = 2
  canvasContext.font = `${fontSize}px ${font}`

  if (textVisuals.ifStroke) {
    canvasContext.lineWidth = textVisuals.strokeWidth
    canvasContext.strokeText(routePoint.name.toUpperCase(), x, y)
  }

  canvasContext.fillStyle = textVisuals.color
  canvasContext.fillText(routePoint.name.toUpperCase(), x, y)
}

export function drawPoint(
  point: Point,
  color: string,
  strokeColor: string,
  width: number,
  strokeWidth: number,
  ifOuterStroke: boolean,
  canvasContext: CanvasRenderingContext2D,
) {
  const path = new Path2D()
  path.rect(point.x - width / 2, point.y - width / 2, width, width)

  // Fill the point with the specified color
  canvasContext.fillStyle = color
  canvasContext.fill(path)

  if (ifOuterStroke) {
    // Add an outer stroke with black, slightly larger
    canvasContext.strokeStyle = 'black'
    canvasContext.lineWidth = strokeWidth + 5
    canvasContext.stroke(path)

    // Add another stroke around the black stroke
    canvasContext.strokeStyle = strokeColor
    canvasContext.lineWidth = strokeWidth
    canvasContext.stroke(path)
  }

  return path
}

export function drawLine(
  point1: Point,
  point2: Point,
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.strokeStyle = color
  canvasContext.lineWidth = width
  canvasContext.beginPath()
  canvasContext.moveTo(point1.x, point1.y)
  canvasContext.lineTo(point2.x, point2.y)
  canvasContext.stroke()
}

interface Point {
  x: number
  y: number
}
