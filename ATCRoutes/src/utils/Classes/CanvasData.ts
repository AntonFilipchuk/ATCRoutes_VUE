import type IGeographicCoordinate from '../Interfaces/IGeographicCoordinate'
import type INormalizationParameters from '../Interfaces/INormalizationParameters'
import calculateBearingAndDistance from '../Modules/bearingAndDistanceCalculator'
import calculateCartesianCoordinate from '../Modules/cartesianCoordinatesCalculator'
import convertCartesianToGeographic from '../Modules/convertCartesianToGeographic'
import normalizeCartesianCoordinates, {
  calculateNormalizationParameters,
  denormalizeCartesianCoordinates,
} from '../Modules/normalizePoints'
import AIPRoute from './AIPRoute/AIPRoute'
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

  conflictPoints: Point[] = []
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

  changeRoutePoint(routePoint: RoutePoint, normalizedX: number, normalizedY: number) {
    routePoint.normalizedCartesianData!.magneticCartesianCoordinates.x = normalizedX
    routePoint.normalizedCartesianData!.magneticCartesianCoordinates.y = normalizedY
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

  //Get aip routes and coordinates
  //Make routes with points with coordinates
  //For each point calculate bearing and distance from origin
  //Set x and y for point based on canvas size

  makeRoutes(
    coordinates: IGeographicCoordinate[],
    AIPRoutes: AIPRoute[],
    originCoordinate: IGeographicCoordinate,
    magneticDeviation: number | undefined,
  ): Route[] {
    const routes = AIPRoutes.map((aipRoute) => {
      const points = aipRoute.points.map((point) => {
        const geoCoordinate = coordinates.find((coordinate) => coordinate.name === point.name)

        if (!geoCoordinate) {
          throw new Error(
            `Can't find coordinate for a Point: ${point.name} in Route:${aipRoute.name}`,
          )
        }
        const bearingAndDistanceFromOrigin = calculateBearingAndDistance(
          originCoordinate as GeographicCoordinate,
          geoCoordinate as GeographicCoordinate,
          magneticDeviation,
        )

        const cartesianCoordinate = calculateCartesianCoordinate(bearingAndDistanceFromOrigin)
        const routePoint = new RoutePoint(
          point.name,
          point.altitude,
          geoCoordinate,
          bearingAndDistanceFromOrigin,
          cartesianCoordinate,
        )

        return routePoint
      })

      const route = new Route(aipRoute.name, points)
      points.forEach((point) => (point.route = route))
      return route
    })

    return routes
  }

  changeSize(newWidth: number, newHeight: number) {
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

  //On resize
  //Find what points were changed
  //Calculate new geo coors for them
  //Based on new geo coors and canvas size calculate new x and y values
  //Update these points

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
