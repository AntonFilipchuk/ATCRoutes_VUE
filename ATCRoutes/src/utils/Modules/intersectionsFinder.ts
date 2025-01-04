import type CanvasRoute from '../Classes/CanvasRoute/CanvasRoute'
import type CanvasPoint from '../Interfaces/CanvasRoute/CanvasPoint'
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute'
import type IConflictPoints from '../Interfaces/IConflictPoint'

export default function findConflictPoints(
  route: ICanvasRoute,
  routes: ICanvasRoute[],
): IConflictPoints[] {
  const intersectionsList: IConflictPoints[] = []
  const routePoints = route.points

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

        const intersections = findIntersections(
          { point: prevPoint, route: route },
          { point: point, route: route },
          { point: prevPoint_, route: route_ },
          { point: point_, route: route_ },
        )

        if (intersections) {
          intersectionsList.push(intersections)
        }
      }
    })
  }
  return intersectionsList
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

interface IRoutePoint {
  point: CanvasPoint
  route: ICanvasRoute
}

function findIntersections(
  d1: IRoutePoint,
  d2: IRoutePoint,
  d3: IRoutePoint,
  d4: IRoutePoint,
): IConflictPoints | undefined {
  //Check if sections are equal
  //Example: [p1 - p2] - [p1 - p2]
  // if (ifTwoEqualSections(point1, point2, point3, point4)) {
  //   return undefined
  // }

  //Check if any section has the same point
  //Example: [p1 - p4] - [p1 - p3]
  //Example: [p1 - p2] - [p2 - p3]
  if (ifSectionsHaveSamePoint(d1.point, d2.point, d3.point, d4.point)) {
    return undefined
  }

  const intersections: IConflictPoint[] = []
  const edgeCases: string[] = []

  const point1 = addAllAltitudesToPoint(d1.point)
  const point2 = addAllAltitudesToPoint(d2.point)
  const point3 = addAllAltitudesToPoint(d3.point)
  const point4 = addAllAltitudesToPoint(d4.point)

  for (const altitude1 of point1.z) {
    for (const altitude2 of point2.z) {
      for (const altitude3 of point3.z) {
        for (const altitude4 of point4.z) {
          const intersection = findIntersection(
            { name: point1.name, x: point1.x, y: point1.y, z: altitude1 },
            { name: point2.name, x: point2.x, y: point2.y, z: altitude2 },
            { name: point3.name, x: point3.x, y: point3.y, z: altitude3 },
            { name: point4.name, x: point4.x, y: point4.y, z: altitude4 },
          )
          if (!intersection) {
            continue
          }
          if (typeof intersection === 'string') {
            edgeCases.push(intersection)
            continue
          }
          intersections.push(intersection)
        }
      }
    }
  }

  return { conflictPoints: intersections, edgeCases: edgeCases }
}

function addAllAltitudesToPoint(routePoint: CanvasPoint): IPoint {
  const tryParseNumber = (n: string): number => {
    let number: unknown
    try {
      number = Number(n)
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Error casting altitude range, wrong type!: ${error}`)
      }
      throw new Error(`Unexpected error casting altitude range!`)
    }

    if (isNaN(number as number)) {
      throw new Error(`Unexpected error casting altitude range!`)
    }

    return number as number
  }
  if (!routePoint.altitude.includes('-')) {
    return {
      name: routePoint.name,
      x: routePoint.x,
      y: routePoint.y,
      z: [tryParseNumber(routePoint.altitude)],
    }
  }

  const point = {
    name: routePoint.name,
    x: routePoint.x,
    y: routePoint.y,
    z: [] as number[],
  }
  const altitudeRange = routePoint.altitude.split('-')
  if (altitudeRange.length != 2) {
    throw new Error(
      `Altitude range "${routePoint.altitude}" for point "${routePoint.name}" has wrong format! `,
    )
  }

  let a1 = tryParseNumber(altitudeRange[0])
  const a2 = tryParseNumber(altitudeRange[1])

  do {
    point.z.push(a1)
    a1 += 10
  } while (a1 < a2)

  return point
}

function findIntersection(
  p1: { name: string; x: number; y: number; z: number },
  p2: { name: string; x: number; y: number; z: number },
  q1: { name: string; x: number; y: number; z: number },
  q2: { name: string; x: number; y: number; z: number },
) {
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

interface IConflictPoint {
  x: number
  y: number
  z: number
  section1: IRouteSection
  section2: IRouteSection
}

interface IRouteSection {
  route: ICanvasRoute
  startPoint: CanvasPoint
  endPoint: CanvasPoint
}

interface IPoint {
  name: string
  x: number
  y: number
  z: number[]
}

interface IPointData {
  point: IPoint
  route: CanvasRoute
}
