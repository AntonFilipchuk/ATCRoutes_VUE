import { v4 as uuidv4 } from 'uuid'
import type ICanvasRoute from '../Interfaces/CanvasRoute/ICanvasRoute'
import type IAerodrome from '../Interfaces/IAerodrome'
import type IRoute from '../Interfaces/IRoute'
import type IRoutePoint from '../Interfaces/IRoutePoint'
import CanvasPoint from '../Interfaces/CanvasRoute/CanvasPoint'
import type { ICanvasAerodrome } from '../Interfaces/CanvasRoute/ICanvasAerodrome'
import { RouteType } from '../Enums/RouteType'
import { RouteCategory } from '../Enums/RouteCategory'
import { AerodromeName } from '../Enums/AerodromeName'

export default class Canvas_Data {
  public width: number
  public height: number
  public originPoint: RoutePoint_
  public deviation: number

  public normalizationParameters: INormalizationParameters

  private standardRoutes: IAerodrome[]
  public customRoutes: ICanvasAerodrome[]
  public filteredStandardRoutes: ICanvasAerodrome[]

  public selectedAerodromeName: AerodromeName = AerodromeName.UUWW
  public selectedRouteType: RouteType = RouteType.STAR
  public selectedRouteCategory: RouteCategory = RouteCategory.CUSTOM
  public selectedRoute: ICanvasRoute | null = null

  constructor(
    width: number,
    height: number,
    deviation: number,
    standardRoutes: IAerodrome[],
    customRoutes: IAerodrome[],
  ) {
    this.width = width
    this.height = height
    this.deviation = deviation
    this.originPoint = new RoutePoint_('Moscow', '0', '554424.63N', '0373636.00E')

    this.standardRoutes = standardRoutes

    this.customRoutes = this.makeCanvasRoutes(customRoutes, false, this.originPoint, deviation)
    this.filteredStandardRoutes = this.makeCanvasRoutes(
      this.filterStandardRoutesIfHaveCustomRoute(standardRoutes, customRoutes),
      true,
      this.originPoint,
      deviation,
    )

    this.normalizationParameters = this.normalizePoints(
      [...this.customRoutes, ...this.filteredStandardRoutes],
      width,
      height,
    )
  }

  private filterStandardRoutesIfHaveCustomRoute(
    standardRoutes: IAerodrome[],
    customRoutes: IAerodrome[],
  ): IAerodrome[] {
    const excludeByUUID = (routes1: IRoute[] = [], routes2: IRoute[] = []): IRoute[] => {
      const idsToExclude = new Set(routes2.map((route) => route.standardRouteId))
      return routes1.filter((route) => !idsToExclude.has(route.id))
    }

    const filteredStandardRoutes: IAerodrome[] = [...standardRoutes]

    return filteredStandardRoutes.map((aerodrome) => {
      const customAerodrome = customRoutes.find((custom) => custom.id === aerodrome.id)

      if (!customAerodrome) {
        return aerodrome
      }

      return {
        ...aerodrome,
        SIDs: excludeByUUID(aerodrome.SIDs, customAerodrome.SIDs),
        STARs: excludeByUUID(aerodrome.STARs, customAerodrome.STARs),
      }
    })
  }

  updatePoint(point: CanvasPoint, x: number, y: number) {
    point.x = x
    point.y = y

    const denormalized = denormalizeCartesianCoordinates(
      x,
      y,
      this.normalizationParameters,
      this.width,
      this.height,
    )

    const newGeographicCoordinates = convertCartesianToGeographic(
      denormalized,
      this.deviation,
      this.originPoint,
    )

    point.calculateNewGeographicCoordinates(newGeographicCoordinates)
  }

  getAerodromeNames(): string[] {
    return [AerodromeName.UUWW, AerodromeName.UUEE, AerodromeName.UUDD]
  }

  setAerodromeName(a: string) {
    this.selectedRoute = null
    this.selectedRouteCategory = RouteCategory.CUSTOM
    this.selectedRouteType = RouteType.STAR
    switch (a) {
      case AerodromeName.UUWW:
        this.selectedAerodromeName = AerodromeName.UUWW
        break
      case AerodromeName.UUEE:
        this.selectedAerodromeName = AerodromeName.UUEE
        break
      case AerodromeName.UUDD:
        this.selectedAerodromeName = AerodromeName.UUDD
        break
      default:
        throw new Error(`Type "${a}" does not match any aerodrome type!`)
    }
  }

  getRouteTypes(): string[] {
    return [RouteType.SID, RouteType.STAR]
  }

  setRouteType(t: string) {
    switch (t) {
      case RouteType.SID:
        this.selectedRouteType = RouteType.SID
        break
      case RouteType.STAR:
        this.selectedRouteType = RouteType.STAR
        break
      default:
        throw new Error(`Type "${t}" does not match any route type!`)
    }
  }

  getRouteCategories(): string[] {
    return [RouteCategory.CUSTOM, RouteCategory.STANDARD]
  }

  setRouteCategory(c: string) {
    switch (c) {
      case RouteCategory.CUSTOM:
        this.selectedRouteCategory = RouteCategory.CUSTOM
        break
      case RouteCategory.STANDARD:
        this.selectedRouteCategory = RouteCategory.STANDARD
        break
      default:
        throw new Error(`Type "${c}" does not match any route category!`)
    }
  }

  getRoutesForSelection(): ICanvasRoute[] {
    if (!this.selectedAerodromeName) {
      throw new Error('Can not get routes because aerodrome is not set!')
    }

    if (!this.selectedRouteType) {
      throw new Error(`Can not get routes because active route type is not set!`)
    }

    let routes = []
    switch (this.selectedRouteCategory) {
      case RouteCategory.CUSTOM:
        routes = this.customRoutes
        break
      case RouteCategory.STANDARD:
        routes = this.filteredStandardRoutes
        break
      default:
        throw new Error(`Can not find routes for selected category "${this.selectedRouteCategory}"`)
    }

    const aerodrome = routes.find((a) => a.name === this.selectedAerodromeName)

    if (!aerodrome) {
      console.warn(
        `Can not find aerodrome name: "${this.selectedAerodromeName}" in "${this.selectedRouteCategory}" routes!`,
      )
      return []
    }

    switch (this.selectedRouteType) {
      case RouteType.SID:
        return aerodrome.SIDs
      case RouteType.STAR:
        return aerodrome.STARs
      default:
        console.warn(
          `Can not find routes of type "${this.selectedRouteType}" in "${this.selectedRouteCategory}" routes for aerodrome: "${this.selectedAerodromeName}"`,
        )
        return []
    }
  }

  makeStandardRouteToCustom(route: ICanvasRoute) {
    if (!route.ifStandard) {
      return
    }

    const uuid = uuidv4()
    route.standardRouteId = route.id
    route.id = uuid
    route.ifStandard = false
  }

  setSelectedRoute = (route: ICanvasRoute) => {
    let previousRoutes: ICanvasAerodrome[] = []

    return () => {
      // If no route is currently selected, assign the provided route and exit.
      if (!this.selectedRoute) {
        this.selectedRoute = route
        console.log('Assigned route:', this.selectedRoute)
        return
      }

      // If the selected route is the same as the provided route, exit early.
      if (this.selectedRoute.id === route.id) {
        return
      }

      // Populate the appropriate previous routes array if it is empty or undefined.
      if (previousRoutes.length === 0) {
        switch (this.selectedRouteCategory) {
          case RouteCategory.CUSTOM:
            previousRoutes = this.customRoutes
            break
          case RouteCategory.STANDARD:
            previousRoutes = this.filteredStandardRoutes
            break
          default:
            throw new Error(`Unknown route category: "${this.selectedRouteCategory}"`)
        }
      }

      // Find the aerodrome matching the route's aerodromeId.
      const aerodrome = previousRoutes.find((a) => a.id === route.aerodromeId)

      if (!aerodrome) {
        throw new Error(`Aerodrome not found for route: "${route.name}"`)
      }

      // Add the route to the appropriate list based on its type.
      switch (route.type) {
        case RouteType.SID:
          aerodrome.SIDs.push(route)
          break
        case RouteType.STAR:
          aerodrome.STARs.push(route)
          break
        default:
          throw new Error(`Unknown route type: "${route.type}"`)
      }

      // Update the selected route.
      this.selectedRoute = route
    }
  }

  public getAllRoutes(): ICanvasRoute[] {
    return this.filteredStandardRoutes
      .concat(this.customRoutes)
      .flatMap((a) => a.SIDs.concat(a.STARs))
  }

  private sortRoutesByName(routes: ICanvasRoute[]) {
    routes.sort((a, b) => a.name.localeCompare(b.name))
  }

  private addRouteToRoutes(route: ICanvasRoute, routes: ICanvasRoute[]) {
    const index = routes.findIndex((r) => r.id === route.id)
    if (index >= 0) {
      return
    }

    routes.push(route)
  }

  private removeRouteFromRoutes(route: ICanvasRoute, routes: ICanvasRoute[]) {
    const index = routes.findIndex((r) => r.id === route.id)
    if (index === -1) {
      return
    }

    routes.splice(index, 1)
  }

  private handleRouteByType(
    route: ICanvasRoute,
    routes: ICanvasAerodrome[],
    callback: (route: ICanvasRoute, routes: ICanvasRoute[]) => void,
  ) {
    console.log(routes)

    const aerodrome = routes.find((a) => a.id === route.aerodromeId)

    if (!aerodrome) {
      throw new Error(`Can't find aerodrome for route "${route.name}" !`)
    }

    switch (route.type) {
      case 'SID':
        callback(route, aerodrome.SIDs)
        break
      case 'STAR':
        callback(route, aerodrome.STARs)
        break
      default:
        throw new Error(
          `Route "${route.name}" type of "${route.type}" doesn't match any route type!`,
        )
    }
  }

  private makeCanvasRoutes(
    aerodromes: IAerodrome[],
    ifStandard: boolean,
    originPoint: RoutePoint_,
    deviation: number,
  ): ICanvasAerodrome[] {
    const canvasAerodromes = aerodromes.map((a): ICanvasAerodrome => {
      const SIDs = a.SIDs.map((SID) =>
        this.makeCanvasRoute(SID, ifStandard, originPoint, deviation),
      )

      const STARs = a.STARs.map((STAR) =>
        this.makeCanvasRoute(STAR, ifStandard, originPoint, deviation),
      )
      return {
        id: a.id,
        name: a.name,
        SIDs: SIDs,
        STARs: STARs,
      }
    })
    return canvasAerodromes
  }

  private makeCanvasRoute(
    route: IRoute,
    ifStandard: boolean,
    originPoint: RoutePoint_,
    deviation: number,
  ): ICanvasRoute {
    const points: RoutePoint_[] = route.points.map(
      (point) => new RoutePoint_(point.name, point.altitude, point.latitude, point.longitude),
    )

    this.setBearingAndDistanceForAllPoints(originPoint, points, deviation)
    this.setCartesianPoints(points)

    const canvasPoints: CanvasPoint[] = points.map((point) => {
      return new CanvasPoint(
        point.name,
        point.cartesianPoint!.x,
        point.cartesianPoint!.y,
        point.altitude,
        point.latitude,
        point.longitude,
      )
    })

    return {
      id: route.id,
      aerodromeId: route.aerodromeId,
      aerodromeName: route.aerodromeName,
      ifStandard: ifStandard,
      name: route.name,
      points: canvasPoints,
      routePointsAsPath2d: [],
      visuals: route.visuals,
      type: route.type,
      runway: route.runway,
      standardRouteId: route.standardRouteId,
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

  normalizePoints(
    routes: ICanvasAerodrome[],
    width: number,
    heigh: number,
  ): INormalizationParameters {
    const allPoints = routes
      .flatMap((aerodrome) => aerodrome.SIDs.concat(aerodrome.STARs))
      .flatMap((route) => route.points)

    const cartesianPoints = allPoints.map((point) => {
      return { x: point.x, y: point.y } as ICartesianPoint
    })

    const np = calculateNormalizationParameters(cartesianPoints, width, heigh)

    allPoints.forEach((point) => {
      point.x = point.x / np.scale + width / 2
      point.y = point.y / np.scale + heigh / 2
    })

    return np
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

function denormalizeCartesianCoordinates(
  x: number,
  y: number,
  np: INormalizationParameters,
  width: number,
  heigh: number,
): { x: number; y: number } {
  return { x: (x - width / 2) * np.scale, y: (y - heigh / 2) * np.scale }
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

function convertCartesianToGeographic(
  cartesianCoordinates: ICartesianPoint,
  deviation: number,
  originCoordinate: RoutePoint_,
): { latitudeDegrees: number; longitudeDegrees: number } {
  // Convert x, y back into distance and bearing
  const distance = Math.sqrt(
    cartesianCoordinates.x * cartesianCoordinates.x +
      cartesianCoordinates.y * cartesianCoordinates.y,
  )

  const radians = Math.atan2(cartesianCoordinates.y, cartesianCoordinates.x)
  let bearing = (radians * (180 / Math.PI) + 90 + 360) % 360 // Adjust from Cartesian to geographic bearing

  bearing = (bearing - deviation + 360) % 360

  // Convert bearing to radians for geographic calculations
  const bearingRadians = (bearing * Math.PI) / 180

  // Convert origin latitude and longitude to radians
  const lat1 = (originCoordinate.latitudeDegrees * Math.PI) / 180
  const lon1 = (originCoordinate.longitudeDegrees * Math.PI) / 180

  // Earth's radius in meters
  const R = 6371e3

  // Calculate new latitude using the haversine formula
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRadians),
  )

  // Calculate new longitude
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRadians) * Math.sin(distance / R) * Math.cos(lat1),
      Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2),
    )

  // Convert results back to degrees
  const latitudeDegrees = (lat2 * 180) / Math.PI
  const longitudeDegrees = (lon2 * 180) / Math.PI

  return {
    latitudeDegrees: latitudeDegrees,
    longitudeDegrees: longitudeDegrees,
  }
}
