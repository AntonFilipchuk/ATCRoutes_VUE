import IntersectionPoint from '../Classes/IntersectionPoint'
import type CanvasPoint from '../Interfaces/CanvasRoute/CanvasPoint'
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute'

export default function findIntersections(
  route: ICanvasRoute,
  routes: ICanvasRoute[],
): IntersectionPoint[] {
  const intersectionPoints: IntersectionPoint[] = []
  const routePoints = route.points

  console.log('Points:', routePoints)

  for (let index = 1; index < routePoints.length; index++) {
    const prevPoint = routePoints[index - 1]
    const point = routePoints[index]

    routes.forEach((route_) => {
      const route_Points = route_.points
      if (route_ === route) {
        throw new Error('Trying to calculate for 2 equal routes!')
      }

      for (let index = 1; index < route_Points.length; index++) {
        const prevPoint_ = route_Points[index - 1]
        const point_ = route_Points[index]

        const intersection: IIntersectionPoint | string | undefined = findIntersection(
          prevPoint,
          point,
          prevPoint_,
          point_,
        )

        if (typeof intersection === 'string') {
          intersectionPoints.push(
            new IntersectionPoint(0, 0, 0, route, route_, [prevPoint, point], [prevPoint_, point_]),
          )
        } else if (intersection) {
          intersectionPoints.push(
            new IntersectionPoint(
              intersection.x,
              intersection.y,
              intersection.z,
              route,
              route_,
              [prevPoint, point],
              [prevPoint_, point_],
            ),
          )
        }
      }
    })
  }
  return intersectionPoints
}

function ifSectionsHaveSamePoint(
  point1: CanvasPoint,
  point2: CanvasPoint,
  point3: CanvasPoint,
  point4: CanvasPoint,
) {
  return (
    ifPointsEqual(point1, point3) ||
    ifPointsEqual(point1, point4) ||
    ifPointsEqual(point2, point3) ||
    ifPointsEqual(point2, point4)
  )
}

function ifPointsEqual(point1: CanvasPoint, point2: CanvasPoint) {
  return (
    point1.name === point2.name &&
    point1.altitude === point2.altitude &&
    point1.latitude === point2.latitude &&
    point1.longitude === point2.longitude
  )
}

function findIntersection(
  point1: CanvasPoint,
  point2: CanvasPoint,
  point3: CanvasPoint,
  point4: CanvasPoint,
): IIntersectionPoint | string | undefined {
  //Check if sections are equal
  //Example: [p1 - p2] - [p1 - p2]
  // if (ifTwoEqualSections(point1, point2, point3, point4)) {
  //   return undefined
  // }

  //Check if any section has the same point
  //Example: [p1 - p4] - [p1 - p3]
  //Example: [p1 - p2] - [p2 - p3]
  if (ifSectionsHaveSamePoint(point1, point2, point3, point4)) {
    return undefined
  }

  const p1 = makePoint(point1)
  const p2 = makePoint(point2)
  const q1 = makePoint(point3)
  const q2 = makePoint(point4)

  function makePoint(routePoint: CanvasPoint): { x: number; y: number; z: number } {
    return {
      x: routePoint.x,
      y: routePoint.y,
      z: +routePoint.altitude,
    }
  }

  const d1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z }
  const d2 = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z }

  // Cross product of direction vectors
  const crossD1D2 = {
    x: d1.y * d2.z - d1.z * d2.y,
    y: d1.z * d2.x - d1.x * d2.z,
    z: d1.x * d2.y - d1.y * d2.x,
  }

  // Check if the cross product is zero (i.e., the lines are parallel)
  if (crossD1D2.x === 0 && crossD1D2.y === 0 && crossD1D2.z === 0) {
    // Lines are parallel; check if they are collinear
    const p1ToQ1 = { x: q1.x - p1.x, y: q1.y - p1.y, z: q1.z - p1.z }
    const crossP1ToQ1D1 = {
      x: p1ToQ1.y * d1.z - p1ToQ1.z * d1.y,
      y: p1ToQ1.z * d1.x - p1ToQ1.x * d1.z,
      z: p1ToQ1.x * d1.y - p1ToQ1.y * d1.x,
    }
    if (crossP1ToQ1D1.x === 0 && crossP1ToQ1D1.y === 0 && crossP1ToQ1D1.z === 0) {
      return 'The lines are collinear and overlap'
    } else {
      return 'The lines are parallel but do not intersect'
    }
  }

  // Lines are not parallel; solve for intersection
  // Calculate determinants
  const t = ((q1.x - p1.x) * d2.y - (q1.y - p1.y) * d2.x) / (d1.x * d2.y - d1.y * d2.x)
  const u = ((p1.x - q1.x) * d1.y - (p1.y - q1.y) * d1.x) / (d2.x * d1.y - d2.y * d1.x)

  if (t < 0 || t > 1 || u < 0 || u > 1) {
    return undefined // Intersection is outside the line segments
  }

  // Calculate potential intersection points on each line
  const intersectP1 = {
    x: Math.round(p1.x + t * d1.x),
    y: Math.round(p1.y + t * d1.y),
    z: Math.round(p1.z + t * d1.z),
  }

  const intersectQ1 = {
    x: Math.round(q1.x + u * d2.x),
    y: Math.round(q1.y + u * d2.y),
    z: Math.round(q1.z + u * d2.z),
  }

  // Check if intersection points match
  if (
    Math.abs(intersectP1.x - intersectQ1.x) < 10 &&
    Math.abs(intersectP1.y - intersectQ1.y) < 10 &&
    Math.abs(intersectP1.z - intersectQ1.z) < 10
  ) {
    return intersectP1 // Intersection point
  } else {
    return undefined
  }
}

interface IIntersectionPoint {
  x: number
  y: number
  z: number
}
