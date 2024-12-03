import type IBearingAndDistance from '../Interfaces/IBearingAndDistance'
import type ICartesianCoordinates from '../Interfaces/ICartesianCoordinates'
import calculateBearingAndDistance from '../Modules/bearingAndDistanceCalculator'
import calculateCartesianCoordinate from '../Modules/cartesianCoordinatesCalculator'
import normalizePoints from '../Modules/normalizePoints'
import AIPRoute from './AIPRoute/AIPRoute'
import type AIPRoutePoint from './AIPRoute/AIPRoutePoint'
import type GeographicCoordinate from './GeographicCoordinate'
import Point from './Point'
import Route from './Route/Route'
import RoutePoint from './Route/RoutePoint'

export default class CanvasData {
  width: number
  height: number
  originCoordinate: GeographicCoordinate
  coordinates: GeographicCoordinate[]
  AIPRoutes: AIPRoute[]
  magneticDeviation: number
  useMagneticBearing: boolean

  points: Point[] = []
  conflictPoints: Point[] = []
  activeRoute: Route | null = null
  inactiveRoutes: Route[] = []
  allRoutes: Route[] = []

  constructor(
    width: number,
    height: number,
    originCoordinate: GeographicCoordinate,
    coordinates: GeographicCoordinate[],
    AIPRoutes: AIPRoute[],
    magneticDeviation: number,
    useMagneticBearing: boolean,
    activeRoute: Route | null = null,
  ) {
    this.AIPRoutes = AIPRoutes
    this.coordinates = coordinates
    this.width = width
    this.height = height
    this.originCoordinate = originCoordinate
    this.magneticDeviation = magneticDeviation
    this.useMagneticBearing = useMagneticBearing
    this.activeRoute = activeRoute

    this.points = this.calculatePoints(
      this.coordinates,
      this.originCoordinate,
      this.magneticDeviation,
      this.useMagneticBearing,
      this.width,
      this.height,
    )

    this.allRoutes = this.makeRoutes(this.AIPRoutes, this.points)
    this.inactiveRoutes = this.allRoutes
  }

  changeSize(newWidth: number, newHeight: number) {
    this.width = newWidth
    this.height = newHeight

    this.points = this.calculatePoints(
      this.coordinates,
      this.originCoordinate,
      this.magneticDeviation,
      this.useMagneticBearing,
      this.width,
      this.height,
    )

    this.allRoutes = this.makeRoutes(this.AIPRoutes, this.points)
    if (this.activeRoute) {
      this.inactiveRoutes = this.allRoutes.slice()
      const activeRoute = this.inactiveRoutes.find((route) => route.name === this.activeRoute?.name)
      if (!activeRoute) {
        throw new Error(
          "Active route was set, but after changing canvas size can't find active route!",
        )
      }
      this.activeRoute = activeRoute
      const routeIndex = this.inactiveRoutes.indexOf(activeRoute)
      this.inactiveRoutes.splice(routeIndex, 1)
    } else {
      this.inactiveRoutes = this.allRoutes
    }
  }

  private calculatePoints(
    coordinates: GeographicCoordinate[],
    originCoordinate: GeographicCoordinate,
    magneticDeviation: number,
    useMagneticBearing: boolean,
    canvasWidth: number,
    canvasHeight: number,
  ): Point[] {
    const points = coordinates.map((coordinate: GeographicCoordinate) => {
      const bearingAndDistance: IBearingAndDistance = calculateBearingAndDistance(
        originCoordinate,
        coordinate,
        magneticDeviation,
      )
      const cartesianCoordinates: ICartesianCoordinates = calculateCartesianCoordinate(
        bearingAndDistance,
        useMagneticBearing,
      )
      return new Point(cartesianCoordinates.x, cartesianCoordinates.y, coordinate)
    })
    return normalizePoints(points, canvasWidth, canvasHeight)
  }

  private makeRoutes(aipRoutes: AIPRoute[], points: Point[]) {
    return aipRoutes.map((route: AIPRoute) => {
      const routePoints: RoutePoint[] = []

      route.points.forEach((point: AIPRoutePoint) => {
        const p = points.find((p) => p.name === point.name)
        if (!p) {
          throw new Error(`Can't find ${point.name} for ${route.name} route in points list!`)
        }
        routePoints.push(new RoutePoint(p.x, p.y, point.altitude, route.name, p.name))
      })
      return new Route(route.name, routePoints)
    })
  }

  setActiveRoute(route: Route) {
    // If the route is already active, do nothing
    if (this.activeRoute === route) return

    // If the new route is inactive, remove it from inactiveRoutes
    const routeIndex = this.inactiveRoutes.indexOf(route)
    if (routeIndex > -1) {
      this.inactiveRoutes.splice(routeIndex, 1)
    }

    // Deactivate the current active route if it exists
    if (this.activeRoute) {
      this.activeRoute.isActive = false
      this.inactiveRoutes.push(this.activeRoute)
    }

    // Set the new active route
    this.activeRoute = route
    this.activeRoute.isActive = true
  }
}
