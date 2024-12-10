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
import { getRandomColor } from '../Modules/randomColorGenerator'
import AIPRoute from './AIPRoute/AIPRoute'
import CanvasRoute from './CanvasRoute/CanvasRoute'
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

  intersectionPoints: IntersectionPoint[] | null = null
  activeCanvasRoute: CanvasRoute | null = null
  inactiveCanvasRoutes: CanvasRoute[] = []
  allCanvasRoutes: CanvasRoute[] = []
  normalizationParameters: INormalizationParameters

  constructor(
    width: number,
    height: number,
    originCoordinate: GeographicCoordinate,
    coordinates: GeographicCoordinate[],
    AIPRoutes: AIPRoute[],
    magneticDeviation: number,
  ) {
    this.AIPRoutes = AIPRoutes
    this.coordinates = coordinates
    this.width = width
    this.height = height
    this.originCoordinate = originCoordinate
    this.magneticDeviation = magneticDeviation

    this.allCanvasRoutes = this.makeRoutes(
      this.coordinates,
      this.AIPRoutes,
      originCoordinate,
      magneticDeviation,
    )
    this.sortRoutesByName(this.allCanvasRoutes)
    this.normalizationParameters = calculateNormalizationParameters(
      this.allCanvasRoutes.map((route) => route.route),
      this.width,
      this.height,
    )

    normalizeCartesianCoordinates(
      this.allCanvasRoutes.map((route) => route.route),
      this.normalizationParameters,
    )
    this.inactiveCanvasRoutes = this.allCanvasRoutes.slice()
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
  ): CanvasRoute[] {
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

    const canvasRoutes = routes.map((route) => {
      const randomColor = getRandomColor()
      const canvasRoute = new CanvasRoute(route)
      canvasRoute.lineColor = randomColor
      canvasRoute.pointColor = randomColor
      return canvasRoute
    })

    return canvasRoutes
  }

  updateIntersectionPoints() {
    if (!this.activeCanvasRoute) {
      throw new Error("Can't find intersections because no active route!")
    }

    const newIntersections = findIntersections(
      this.activeCanvasRoute.route,
      this.inactiveCanvasRoutes.map((route) => route.route),
    )

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
      this.allCanvasRoutes.map((route) => route.route),
      this.width,
      this.height,
    )

    normalizeCartesianCoordinates(
      this.allCanvasRoutes.map((route) => route.route),
      this.normalizationParameters,
    )

    if (this.activeCanvasRoute) {
      this.inactiveCanvasRoutes = this.allCanvasRoutes.slice()
      const activeRoute = this.inactiveCanvasRoutes.find(
        (route) => route.name === this.activeCanvasRoute?.name,
      )
      if (!activeRoute) {
        throw new Error(
          "Active route was set, but after changing canvas size can't find active route!",
        )
      }
      this.activeCanvasRoute = activeRoute
      const routeIndex = this.inactiveCanvasRoutes.indexOf(activeRoute)
      this.inactiveCanvasRoutes.splice(routeIndex, 1)
    } else {
      this.inactiveCanvasRoutes = this.allCanvasRoutes.slice()
    }
  }

  setActiveRoute(route: CanvasRoute) {
    if (!this.activeCanvasRoute) {
      this.activeCanvasRoute = this.activeCanvasRoute
    }

    // If the route is already active, do nothing
    if (this.activeCanvasRoute === route) return

    // If the new route is inactive, remove it from inactiveRoutes
    const routeIndex = this.inactiveCanvasRoutes.indexOf(route)
    if (routeIndex > -1) {
      this.inactiveCanvasRoutes.splice(routeIndex, 1)
    }

    // Deactivate the current active route if it exists
    if (this.activeCanvasRoute) {
      this.inactiveCanvasRoutes.push(this.activeCanvasRoute)
    }
    this.activeCanvasRoute = route

    this.sortRoutesByName(this.inactiveCanvasRoutes)
  }

  private sortRoutesByName(routes: CanvasRoute[]) {
    routes.sort((a, b) => {
      const nameA = a.name.toUpperCase() // ignore upper and lowercase
      const nameB = b.name.toUpperCase() // ignore upper and lowercase
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }

      // names must be equal
      return 0
    })
  }
}
