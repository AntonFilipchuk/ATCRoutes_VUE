import type ICanvasPoint from '../Interfaces/CanvasRoute/ICanvasPoint'
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute'
import type IAerodrome from '../Interfaces/IAerodrome'
import type IRoute from '../Interfaces/IRoute'
import type IRoutePoint from '../Interfaces/IRoutePoint'

export default class Canvas_Data {
  STARs: ICanvasRoute[]
  SIDs: ICanvasRoute[]
  constructor(width: number, height: number, deviation: number, aerodromes: IAerodrome[]) {
    const originPoint: RoutePoint_ = new RoutePoint_('Moscow', '0', '554424.63N', '0373636.00E')
    this.SIDs = aerodromes[0].SIDs.map((SID) => {
      return this.makeCanvasRoute(SID, width, height, originPoint, deviation)
    })

    this.STARs = aerodromes[0].STARs.map((STAR) => {
      return this.makeCanvasRoute(STAR, width, height, originPoint, deviation)
    })
  }

  makeCanvasRoute(
    route: IRoute,
    width: number,
    heigh: number,
    originPoint: RoutePoint_,
    deviation: number,
  ): ICanvasRoute {
    const points: RoutePoint_[] = route.points.map(
      (point) => new RoutePoint_(point.name, point.altitude, point.latitude, point.longitude),
    )

    this.setBearingAndDistanceForAllPoints(originPoint, points, deviation)
    this.setCartesianPoints(points)
    this.normalizePoints(points, width, heigh)

    const canvasPoints: ICanvasPoint[] = points.map((point) => {
      if (!point.normalizedCartesianPoint) {
        throw new Error(`Point ${point.name} doesn't have normalized cartesian coordinates!`)
      }
      return {
        altitude: point.altitude,
        name: point.name,
        x: point.normalizedCartesianPoint.x,
        y: point.normalizedCartesianPoint.y,
      }
    })

    return {
      name: route.name,
      points: canvasPoints,
      routeVisuals: route.visuals,
      routePointsAsPath2d: [],
    }
  }

  setBearingAndDistanceForAllPoints(
    originCoordinate: RoutePoint_,
    points: RoutePoint_[],
    deviation: number,
  ) {
    return points.forEach((point) =>
      point.setBearingAndDistance(calculateBearingAndDistance(originCoordinate, point, deviation)),
    )
  }

  setCartesianPoints(points: RoutePoint_[]) {
    points.forEach((point) => {
      if (!point.bearingAndDistance) {
        throw new Error(`Point ${point.name} doesn't have bearing and distance!`)
      }

      point.setCartesianPoint(calculateCartesianCoordinate(point.bearingAndDistance))
    })
  }

  normalizePoints(points: RoutePoint_[], width: number, heigh: number) {
    const cartesianPoints = points.map((point) => {
      if (!point.cartesianPoint) {
        throw new Error(`Point ${point.name} doesn't have cartesian coordinates!`)
      }

      return point.cartesianPoint
    })

    const np = calculateNormalizationParameters(cartesianPoints, width, heigh)

    points.forEach((point) => {
      const normalized: ICartesianPoint = {
        x: point.cartesianPoint!.x / np.scale + width / 2,
        y: point.cartesianPoint!.y / np.scale + heigh / 2,
      }

      point.normalizedCartesianPoint = normalized
    })
  }
}

interface ICartesianPoint {
  x: number
  y: number
}

interface INormalizationParameters {
  maxX: number
  maxY: number
  scale: number
}

interface IBearingAndDistance {
  name: string
  distance: number
  bearing: number
}

function calculateNormalizationParameters(
  cartesianPoints: ICartesianPoint[],
  width: number,
  heigh: number,
): INormalizationParameters {
  const maxX = Math.max(...cartesianPoints.map((point) => point.x))
  const maxY = Math.max(...cartesianPoints.map((point) => point.y))
  const scale = Math.max(maxX / (width - width / 2), maxY / (heigh - heigh / 2))
  return { maxX: maxX, maxY: maxY, scale: scale }
}

function calculateCartesianCoordinate(bd: IBearingAndDistance): ICartesianPoint {
  const radians = (bd.bearing - 90) * (Math.PI / 180)
  return {
    x: bd.distance * Math.cos(radians),
    y: bd.distance * Math.sin(radians),
  }
}

function calculateBearingAndDistance(
  originCoordinate: RoutePoint_,
  coordinate: RoutePoint_,
  magneticDeviation: number = 0,
): IBearingAndDistance {
  const lat1 = originCoordinate.latitudeDegrees
  const lon1 = originCoordinate.longitudeDegrees
  const lat2 = coordinate.latitudeDegrees
  const lon2 = coordinate.longitudeDegrees

  const R = 6371e3 // Earth's radius in meters

  // Convert latitude and longitude from degrees to radians
  const f1 = (lat1 * Math.PI) / 180
  const f2 = (lat2 * Math.PI) / 180
  const deltaF = ((lat2 - lat1) * Math.PI) / 180
  const deltaL = ((lon2 - lon1) * Math.PI) / 180

  // Haversine formula for distance
  const a =
    Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
    Math.cos(f1) * Math.cos(f2) * Math.sin(deltaL / 2) * Math.sin(deltaL / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  // Formula for initial true bearing
  const y = Math.sin(deltaL) * Math.cos(f2)
  const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(deltaL)
  const trueBearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360

  // Adjust bearing with magnetic deviation
  const magneticBearing = (trueBearing + magneticDeviation + 360) % 360

  return <IBearingAndDistance>{
    name: coordinate.name,
    distance: distance,
    bearing: magneticBearing,
  }
}

class RoutePoint_ implements IRoutePoint {
  name: string
  altitude: string
  latitude: string
  longitude: string

  latitudeDegrees: number
  longitudeDegrees: number

  bearingAndDistance: IBearingAndDistance | undefined
  cartesianPoint: ICartesianPoint | undefined
  normalizedCartesianPoint: ICartesianPoint | undefined

  constructor(name: string, altitude: string, latitude: string, longitude: string) {
    this.name = name
    this.altitude = altitude
    this.latitude = latitude
    this.longitude = longitude

    this.latitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(latitude))
    this.longitudeDegrees = this.convertCoordinateToDegrees(this.toNumber(longitude))
  }

  public setBearingAndDistance(bd: IBearingAndDistance) {
    this.bearingAndDistance = bd
  }

  public setCartesianPoint(cp: ICartesianPoint) {
    this.cartesianPoint = cp
  }

  public setNormalizedCartesianPoint(ncp: ICartesianPoint) {
    this.normalizedCartesianPoint = ncp
  }

  private toNumber(prop: string): number {
    const noPostfix = prop.slice(0, -1)

    if (noPostfix.length == 9) {
      return +noPostfix
    } else if (noPostfix.length == 10) {
      return +noPostfix.substring(1)
    } else {
      throw new Error(`${prop} is in wrong format!`)
    }
  }

  private convertCoordinateToDegrees(coordinate: number): number {
    // Convert the number to a string to handle slicing
    const coordStr = coordinate.toFixed(2).padStart(8, '0') // Ensure fixed decimal format

    // Parse degrees, minutes, and seconds
    const degrees = parseInt(coordStr.slice(0, 2), 10) // First 2 digits are degrees
    const minutes = parseInt(coordStr.slice(2, 4), 10) // Next 2 digits are minutes
    const seconds = parseFloat(coordStr.slice(4)) // Remaining digits are seconds

    // Convert to decimal degrees
    return degrees + minutes / 60 + seconds / 3600
  }
}
