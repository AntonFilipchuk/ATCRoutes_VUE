import type Point from '../Classes/Point'

export default function normalizePoints(
  points: Point[],
  canvasWidth: number,
  canvasHeight: number,
): Point[] {
  // Find the maximum x and y values in the points array
  const maxX = Math.max(...points.map((point) => Math.abs(point.x)))
  const maxY = Math.max(...points.map((point) => Math.abs(point.y)))

  // Determine the scaling factor to fit within the canvas
  const scale = Math.max(maxX / (canvasWidth - canvasWidth / 2), maxY / (canvasHeight - canvasWidth / 2))

  // Normalize points to fit into the canvas
  return points.map((point) => ({
    x: point.x / scale + canvasWidth / 2,
    y: point.y / scale + canvasHeight / 2,
    name: point.name,
    geographicOrigin: point.geographicOrigin,
  }))
}
