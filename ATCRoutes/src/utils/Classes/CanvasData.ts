import type IGeographicCoordinate from '../Interfaces/IGeographicCoordinate'
import type INormalizationParameters from '../Interfaces/INormalizationParameters'
import calculateBearingAndDistance from '../Modules/bearingAndDistanceCalculator'
import calculateCartesianCoordinate from '../Modules/cartesianCoordinatesCalculator'
import convertCartesianToGeographic from '../Modules/convertCartesianToGeographic'
import findIntersections from '../Modules/intersectionsFinder'
import normalizeCartesianCoordinates, {
  calculateNormalizationParameters,
  denormalizeCartesianCoordinates,
} from '../Modules/normalizePoints'
import AIPRoute from './AIPRoute/AIPRoute'
import type GeographicCoordinate from './GeographicCoordinate'
import type IntersectionPoint from './IntersectionPoint'
import Route from './Route/Route'
import RoutePoint from './Route/RoutePoint'

export default class CanvasData {
  width: number
  height: number
  originCoordinate: GeographicCoordinate
  coordinates: GeographicCoordinate[]
  AIPRoutes: AIPRoute[]
  magneticDeviation: number

  intersectionPoints: IntersectionPoint[] | null
  activeRoute: Route | null = null
  inactiveRoutes: Route[] = []
  allRoutes: Route[] = []
  normalizationParameters: INormalizationParameters

  constructor(
    width: number,
    height: number,
    originCoordinate: GeographicCoordinate,
    coordinates: GeographicCoordinate[],
    AIPRoutes: AIPRoute[],
    magneticDeviation: number,
    activeRoute: Route | null = null,
  ) {
    this.AIPRoutes = AIPRoutes
    this.coordinates = coordinates
    this.width = width
    this.height = height
    this.originCoordinate = originCoordinate
    this.magneticDeviation = magneticDeviation
    this.activeRoute = activeRoute
    this.intersectionPoints = null

    this.allRoutes = this.makeRoutes(
      this.coordinates,
      this.AIPRoutes,
      originCoordinate,
      magneticDeviation,
    )
    this.normalizationParameters = calculateNormalizationParameters(
      this.allRoutes,
      this.width,
      this.height,
    )

    normalizeCartesianCoordinates(this.allRoutes, this.normalizationParameters)
    this.inactiveRoutes = this.allRoutes.slice()
  }

  updateRoutePointCoordinates(routePoint: RoutePoint, normalizedX: number, normalizedY: number) {
    routePoint.getNormalizedCartesianCoordinates().x = normalizedX
    routePoint.getNormalizedCartesianCoordinates().y = normalizedY

    const denormalizedCoordinates = denormalizeCartesianCoordinates(
      normalizedX,
      normalizedY,
      this.normalizationParameters,
    )

    routePoint.cartesianData.magneticCartesianCoordinates.x = denormalizedCoordinates.x
    routePoint.cartesianData.magneticCartesianCoordinates.y = denormalizedCoordinates.y

    const newGeoCoordinates = convertCartesianToGeographic(
      routePoint.cartesianData.magneticCartesianCoordinates,
      routePoint.bearingAndDistance.originCoordinate,
      routePoint.name,
    )

    routePoint.geographicCoordinate = newGeoCoordinates
  }

  private makeRoutes(
    coordinates: IGeographicCoordinate[],
    AIPRoutes: AIPRoute[],
    originCoordinate: IGeographicCoordinate,
    magneticDeviation: number | undefined,
  ): Route[] {
    const routes: Route[] = AIPRoutes.map((aipRoute) => {
      const route = new Route(aipRoute.name)
      const points = aipRoute.points.map((point) => {
        const geoCoordinate = coordinates.find((coordinate) => coordinate.name === point.name)

        if (!geoCoordinate) {
          throw new Error(
            `Can't find coordinate for Point: ${point.name} in Route: ${aipRoute.name}`,
          )
        }

        const bearingAndDistanceFromOrigin = calculateBearingAndDistance(
          originCoordinate as GeographicCoordinate,
          geoCoordinate as GeographicCoordinate,
          magneticDeviation,
        )

        const cartesianCoordinate = calculateCartesianCoordinate(bearingAndDistanceFromOrigin)

        return new RoutePoint(
          point.name,
          point.altitude,
          geoCoordinate,
          bearingAndDistanceFromOrigin,
          cartesianCoordinate,
          route,
        )
      })

      route.setPoints(points)
      return route
    })

    return routes
  }

  updateIntersectionPoints() {
    if (!this.activeRoute) {
      throw new Error("Can't find intersections because no active route!")
    }

    const newIntersections = findIntersections(this.activeRoute, this.inactiveRoutes)

    if (
      !this.intersectionPoints ||
      this.intersectionPoints.length !== newIntersections.length ||
      !this.arePointsEqual(this.intersectionPoints, newIntersections)
    ) {
      this.intersectionPoints = newIntersections
    }
  }

  private arePointsEqual(pointsA: IntersectionPoint[], pointsB: IntersectionPoint[]): boolean {
    return (
      pointsA.length === pointsB.length &&
      pointsA.every((pointA, index) => {
        const pointB = pointsB[index]
        return pointA.x === pointB.x && pointA.y === pointB.y && pointA.z === pointB.z
      })
    )
  }

  changeSize(newWidth: number, newHeight: number) {
    console.log('change size!')

    this.width = newWidth
    this.height = newHeight

    this.normalizationParameters = calculateNormalizationParameters(
      this.allRoutes,
      this.width,
      this.height,
    )

    normalizeCartesianCoordinates(this.allRoutes, this.normalizationParameters)

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
      this.inactiveRoutes = this.allRoutes.slice()
    }
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
