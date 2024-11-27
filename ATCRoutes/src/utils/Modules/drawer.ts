import type RoutePoint from '../Classes/Route/RoutePoint'

export function drawPoints(
  points: RoutePoint[],
  color: string,
  width: number,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasContext.fillStyle = color
  points.forEach((point) => {
    point.path2D = drawPoint(point, width, canvasContext)
  })
}

export function drawPoint(
  point: { x: number; y: number },
  width: number,
  canvasContext: CanvasRenderingContext2D,
): Path2D {
  const path = new Path2D()
  path.rect(point.x - width / 2, point.y - width / 2, width, width)
  canvasContext.stroke(path)
  canvasContext.fill(path)
  return path
}

export default function drawLines(
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
      canvasContext.moveTo(point.x, point.y)
    } else {
      canvasContext.lineTo(point.x, point.y)
    }
  })

  canvasContext.stroke()
}

export function cleanCanvas(canvasContext: CanvasRenderingContext2D) {
  canvasContext.clearRect(0, 0, 10000000, 10000000)
}
//export default function drawLine() {}
