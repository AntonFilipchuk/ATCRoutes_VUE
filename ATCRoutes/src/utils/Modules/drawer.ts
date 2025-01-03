import type ICanvasPoint from '../Interfaces/CanvasRoute/ICanvasPoint'
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute'
import type IRouteVisuals from '../Interfaces/Visuals/IRouteVisuals'
import type ITextVisual from '../Interfaces/Visuals/ITextVisual'
import type IVisual from '../Interfaces/Visuals/IVisual'

export function drawSelectedRoute(
  canvasRoute: ICanvasRoute,
  routeVisuals: IRouteVisuals,
  canvasContext: CanvasRenderingContext2D,
) {
  drawLines(canvasRoute, routeVisuals, canvasContext)
  const points = canvasRoute.points
  points.forEach((point) => {
    canvasRoute.routePointsAsPath2d.push({
      name: point.name,
      path2d: drawPoint(point, routeVisuals.pointVisuals, canvasContext),
    })
  })
}
export function drawPoints(
  canvasRoute: ICanvasRoute,
  routeVisuals: IRouteVisuals,
  canvasContext: CanvasRenderingContext2D,
) {
  const pointsVisuals = routeVisuals.pointVisuals
  const points = canvasRoute.points
  points.forEach((point) => {
    canvasRoute.routePointsAsPath2d.push({
      name: point.name,
      path2d: drawPoint(point, pointsVisuals, canvasContext),
    })
  })
}

export function drawPoint(
  point: ICanvasPoint,
  visuals: IVisual,
  canvasContext: CanvasRenderingContext2D,
) {
  const path = new Path2D()

  const x = point.x
  const y = point.y
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

export function drawConflictPoint(
  point: Point,
  visuals: IVisual,
  canvasContext: CanvasRenderingContext2D,
) {
  const path = new Path2D()
  const x = point.x
  const y = point.y
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

export function drawLines(
  canvasRoute: ICanvasRoute,
  routeVisuals: IRouteVisuals,
  canvasContext: CanvasRenderingContext2D,
) {
  const visuals = routeVisuals.lineVisuals

  const linePath = new Path2D()

  const points = canvasRoute.points

  points.forEach((point, index) => {
    const x = point.x
    const y = point.y
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

export function drawRouteText(
  canvasRoute: ICanvasRoute,
  routeVisuals: IRouteVisuals,
  canvasContext: CanvasRenderingContext2D,
) {
  canvasRoute.points.forEach((point) => drawText(point, routeVisuals.textVisuals, canvasContext))
}

export function drawText(
  point: ICanvasPoint,
  textVisuals: ITextVisual,
  canvasContext: CanvasRenderingContext2D,
) {
  const font = textVisuals.font.toLowerCase()
  const fontSize = textVisuals.width
  const x = point.x + textVisuals.xOffset
  const y = point.y + textVisuals.yOffset

  canvasContext.miterLimit = 2
  canvasContext.font = `${fontSize}px ${font}`

  if (textVisuals.ifStroke) {
    canvasContext.lineWidth = textVisuals.strokeWidth
    canvasContext.strokeText(point.name.toUpperCase(), x, y)
  }

  canvasContext.fillStyle = textVisuals.color
  canvasContext.fillText(point.name.toUpperCase() + ` ${point.altitude}`, x, y)
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
