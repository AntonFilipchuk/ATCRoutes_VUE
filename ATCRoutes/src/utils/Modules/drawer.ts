import type RoutePoint from '../Classes/Route/RoutePoint'

export function drawRoutePoints(
  points: RoutePoint[],
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.fillStyle = color
  points.forEach((point) => {
    point.path2D = drawRoutePoint(point.getNormalizedCartesianCoordinates(), width, canvasContext)
  })
}

export function drawRoutePoint(
  point: { x: number; y: number },
  width: number,
  canvasContext: CanvasRenderingContext2D,
): Path2D {
  const path = new Path2D()
  path.rect(point.x - width / 2, point.y - width / 2, width, width)
  canvasContext.lineWidth = 10
  canvasContext.stroke(path)
  canvasContext.fill(path)
  return path
}

export default function drawRouteLines(
  points: RoutePoint[],
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.beginPath()
  canvasContext.strokeStyle = color
  canvasContext.lineWidth = width

  points.forEach((point, index) => {
    if (index === 0) {
      canvasContext.moveTo(
        point.getNormalizedCartesianCoordinates().x,
        point.getNormalizedCartesianCoordinates().y,
      )
    } else {
      canvasContext.lineTo(
        point.getNormalizedCartesianCoordinates().x,
        point.getNormalizedCartesianCoordinates().y,
      )
    }
  })

  canvasContext.stroke()
}

export function cleanCanvas(canvasContext: CanvasRenderingContext2D) {
  canvasContext.clearRect(0, 0, 10000000, 10000000)
}

export function drawText(
  routePoint: RoutePoint,
  textSize: number,
  textFont: string,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.font = `${textSize}px ${textFont.toLowerCase()}`
  const x = routePoint.getNormalizedCartesianCoordinates().x
  const y = routePoint.getNormalizedCartesianCoordinates().y
  canvasContext.fillText(routePoint.name, x + x / 50, y + y / 50)
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
