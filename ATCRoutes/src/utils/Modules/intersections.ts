import type CanvasPoint from '../Interfaces/CanvasRoute/CanvasPoint';
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute';
import type { IConflictPoint } from '../Interfaces/IConflictPoint';

export default function findConflictPoints(route: ICanvasRoute, routes: ICanvasRoute[])
{
  const routePoints = route.points;
  const conflicts: IConflictPoint[] = [];
  for (let index = 1; index < routePoints.length; index++)
  {
    const prevPoint = routePoints[index - 1];
    const point = routePoints[index];


    routes.forEach((route_) =>
    {
      const route_Points = route_.points;
      if (route_ === route)
      {
        throw new Error('Trying to calculate for 2 equal routes!');
      }

      for (let index = 1; index < route_Points.length; index++)
      {
        const prevPoint_ = route_Points[index - 1];
        const point_ = route_Points[index];

        const p1Al = getAltitudeRange(prevPoint);
        const p2Al = getAltitudeRange(point);
        const p3Al = getAltitudeRange(prevPoint_);
        const p4Al = getAltitudeRange(point_);
        let conflict: IConflictPoint | null = null;

        for (const a1 of p1Al)
        {
          for (const a2 of p2Al)
          {
            for (const a3 of p3Al)
            {
              for (const a4 of p4Al)
              {
                const p1: IPoint = { name: prevPoint.name, route: route, x: prevPoint.x, y: prevPoint.y, z: a1 };
                const p2: IPoint = { name: point.name, route: route, x: point.x, y: point.y, z: a2 };
                const p3: IPoint = { name: prevPoint_.name, route: route_, x: prevPoint_.x, y: prevPoint_.y, z: a3 };
                const p4: IPoint = { name: point_.name, route: route_, x: point_.x, y: point_.y, z: a4 };

                const intersection = findIntersection(p1, p2, p3, p4);

                if (!intersection)
                {
                  continue;
                }

                if (typeof intersection === "string")
                {
                  continue;
                }

                if (!conflict)
                {
                  conflict = {
                    route1: route,
                    route2: route_,
                    section1: [prevPoint, point],
                    section2: [prevPoint_, point_],
                    x: intersection.x,
                    y: intersection.y,
                    z: [intersection.z]
                  };
                }

                conflict.z.push(intersection.z);
                conflicts.push(conflict)
              }
            }
          }
        }
      }
    });
  }
  return conflicts
}

function getAltitudeRange(routePoint: CanvasPoint): number[]
{
  const tryParseNumber = (n: string): number =>
  {
    let number: unknown;
    try
    {
      number = Number(n);
    } catch (error)
    {
      if (error instanceof TypeError)
      {
        throw new Error(`Error casting altitude range, wrong type!: ${error}`);
      }
      throw new Error(`Unexpected error casting altitude range!`);
    }

    if (isNaN(number as number))
    {
      throw new Error(`Unexpected error casting altitude range!`);
    }

    return number as number;
  };
  if (!routePoint.altitude.includes('-'))
  {
    return [tryParseNumber(routePoint.altitude)];
  }

  const altitudeRange = routePoint.altitude.split('-');
  if (altitudeRange.length != 2)
  {
    throw new Error(
      `Altitude range "${routePoint.altitude}" for point "${routePoint.name}" has wrong format! `,
    );
  }

  const range: number[] = [];
  let a1 = tryParseNumber(altitudeRange[0]);
  const a2 = tryParseNumber(altitudeRange[1]);

  do
  {
    range.push(a1);
    a1 += 10;
  } while (a1 < a2);

  return range;
}

interface IPoint
{
  name: string;
  route: ICanvasRoute;
  x: number;
  y: number;
  z: number;
}

interface IIntersection
{
  route1: ICanvasRoute;
  route2: ICanvasRoute;
  x: number;
  y: number;
  z: number;
  section1: string[];
  section2: string[];
}
function findIntersection(
  p1: IPoint,
  p2: IPoint,
  q1: IPoint,
  q2: IPoint,
): string | undefined | IIntersection
{
  const d1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  const d2 = { x: q2.x - q1.x, y: q2.y - q1.y, z: q2.z - q1.z };

  // Cross product of direction vectors
  const crossD1D2 = {
    x: d1.y * d2.z - d1.z * d2.y,
    y: d1.z * d2.x - d1.x * d2.z,
    z: d1.x * d2.y - d1.y * d2.x,
  };

  // Check if the cross product is zero (i.e., the lines are parallel)
  if (crossD1D2.x === 0 && crossD1D2.y === 0 && crossD1D2.z === 0)
  {
    // Lines are parallel; check if they are collinear
    const p1ToQ1 = { x: q1.x - p1.x, y: q1.y - p1.y, z: q1.z - p1.z };
    const crossP1ToQ1D1 = {
      x: p1ToQ1.y * d1.z - p1ToQ1.z * d1.y,
      y: p1ToQ1.z * d1.x - p1ToQ1.x * d1.z,
      z: p1ToQ1.x * d1.y - p1ToQ1.y * d1.x,
    };
    if (crossP1ToQ1D1.x === 0 && crossP1ToQ1D1.y === 0 && crossP1ToQ1D1.z === 0)
    {
      return 'The lines are collinear and overlap';
    } else
    {
      return 'The lines are parallel but do not intersect';
    }
  }

  // Lines are not parallel; solve for intersection
  // Calculate determinants
  const t = ((q1.x - p1.x) * d2.y - (q1.y - p1.y) * d2.x) / (d1.x * d2.y - d1.y * d2.x);
  const u = ((p1.x - q1.x) * d1.y - (p1.y - q1.y) * d1.x) / (d2.x * d1.y - d2.y * d1.x);

  if (t < 0 || t > 1 || u < 0 || u > 1)
  {
    return undefined; // Intersection is outside the line segments
  }

  // Calculate potential intersection points on each line
  const intersectP1: IIntersection = {
    route1: p1.route,
    route2: q2.route,
    section1: [p1.name, p2.name],
    section2: [q1.name, q2.name],
    x: Math.round(p1.x + t * d1.x),
    y: Math.round(p1.y + t * d1.y),
    z: Math.round(p1.z + t * d1.z),
  };

  const intersectQ1 = {
    x: Math.round(q1.x + u * d2.x),
    y: Math.round(q1.y + u * d2.y),
    z: Math.round(q1.z + u * d2.z),
  };

  // Check if intersection points match
  if (
    Math.abs(intersectP1.x - intersectQ1.x) < 10 &&
    Math.abs(intersectP1.y - intersectQ1.y) < 10 &&
    Math.abs(intersectP1.z - intersectQ1.z) < 10
  )
  {
    return intersectP1; // Intersection point
  } else
  {
    return undefined;
  }
}
