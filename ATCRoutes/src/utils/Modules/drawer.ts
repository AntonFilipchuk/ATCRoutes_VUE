import type RoutePoint from '../Classes/Route/RoutePoint'

export function drawRoutePoints(
  points: RoutePoint[],
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.fillStyle = color
  points.forEach((point) => {
    point.path2D = drawRoutePoint(
      point.normalizedCartesianData!.magneticCartesianCoordinates,
      width,
      canvasContext,
    )
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
        point.normalizedCartesianData!.magneticCartesianCoordinates.x,
        point.normalizedCartesianData!.magneticCartesianCoordinates.y,
      )
    } else {
      canvasContext.lineTo(
        point.normalizedCartesianData!.magneticCartesianCoordinates.x,
        point.normalizedCartesianData!.magneticCartesianCoordinates.y,
      )
    }
  })

  canvasContext.stroke()
}

export function cleanCanvas(canvasContext: CanvasRenderingContext2D) {
  canvasContext.clearRect(0, 0, 10000000, 10000000)
}

export function drawPoint(
  point: Point,
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  const path = new Path2D()
  path.rect(point.x - width / 2, point.y - width / 2, width, width)
  canvasContext.fillStyle = color
  canvasContext.fill(path)
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
