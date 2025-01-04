import type {
  IBearingAndDistance,
  ICartesianPoint,
  INormalizationParameters,
} from '@/utils/Classes/Route/Interfaces'
import RoutePoint_ from '@/utils/Classes/Route/RoutePoint_'
import { AerodromeName } from '@/utils/Enums/AerodromeName'
import { RouteType } from '@/utils/Enums/RouteType'
import CanvasPoint from '@/utils/Interfaces/CanvasRoute/CanvasPoint'
import type { ICanvasAerodrome } from '@/utils/Interfaces/CanvasRoute/ICanvasAerodrome'
import type ICanvasRoute from '@/utils/Interfaces/CanvasRoute/ICanvasRoute'
import type IAerodrome from '@/utils/Interfaces/IAerodrome'
import type { IConflictPoint } from '@/utils/Interfaces/IConflictPoint';
import type IRoute from '@/utils/Interfaces/IRoute'
import type IRouteVisuals from '@/utils/Interfaces/Visuals/IRouteVisuals'
import type IVisual from '@/utils/Interfaces/Visuals/IVisual'
import findConflictPoints from '@/utils/Modules/intersections';
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

const useCanvasPropertiesState = defineStore('canvas-properties-private', () => {
  const width = ref(0)
  const height = ref(0)
  const deviation = ref(0)
  const originPoint = ref<RoutePoint_ | undefined>(undefined)
  const customRoutes: Ref<ICanvasAerodrome[] | undefined> = ref<ICanvasAerodrome[] | undefined>(
    undefined,
  )
  const standardRoutes: Ref<ICanvasAerodrome[] | undefined> = ref<ICanvasAerodrome[] | undefined>(
    undefined,
  )

  const selectedRouteVisuals: Ref<IRouteVisuals | undefined> = ref(undefined)
  const conflictPointVisuals: Ref<IVisual | undefined> = ref(undefined)
  const previousRoutes: Ref<ICanvasRoute[] | null> = ref<ICanvasRoute[] | null>(null)

  return {
    width,
    height,
    deviation,
    originPoint,
    customRoutes,
    standardRoutes,
    previousRoutes,
    selectedRouteVisuals,
    conflictPointVisuals,
  }
})

export const canvasStore = defineStore('canvasStore', () => {
  const canvasPropertiesState = useCanvasPropertiesState()
  const np = ref<INormalizationParameters | undefined>(undefined)
  const selectedAerodromeName = ref(AerodromeName.UUWW)
  const selectedRouteType = ref(RouteType.STAR)
  const ifSelectedRouteStandard = ref(false)
  const selectedRoute = ref<ICanvasRoute | null>(null)
  const conflictPoints: Ref<IConflictPoint[]> = ref([])

  function init(
    width: number,
    height: number,
    deviation: number,
    standardRoutes: IAerodrome[],
    customRoutes: IAerodrome[],
    selectedRouteVisuals: IRouteVisuals,
    conflictPointVisuals: IVisual,
    originPoint: RoutePoint_,
  ) {
    canvasPropertiesState.width = width
    canvasPropertiesState.height = height
    canvasPropertiesState.deviation = deviation
    canvasPropertiesState.originPoint = originPoint
    canvasPropertiesState.selectedRouteVisuals = selectedRouteVisuals
    canvasPropertiesState.conflictPointVisuals = conflictPointVisuals
    canvasPropertiesState.customRoutes = makeCanvasRoutes(
      customRoutes,
      false,
      originPoint,
      deviation,
    )
    canvasPropertiesState.standardRoutes = makeCanvasRoutes(
      filterStandardRoutesIfHaveCustomRoute(standardRoutes, customRoutes),
      true,
      originPoint,
      deviation,
    )
    np.value = normalizePoints(
      [...canvasPropertiesState.customRoutes, ...canvasPropertiesState.standardRoutes],
      width,
      height,
    )
  }

  function getRoutesForSelection() {
    let aerodromes: ICanvasAerodrome[] = []

    if (ifSelectedRouteStandard.value) {
      aerodromes = canvasPropertiesState.standardRoutes!
    } else {
      aerodromes = canvasPropertiesState.customRoutes!
    }

    let aerodrome: ICanvasAerodrome | undefined

    switch (selectedAerodromeName.value) {
      case AerodromeName.UUDD:
        aerodrome = aerodromes.find((a) => a.name === AerodromeName.UUDD)
        break
      case AerodromeName.UUWW:
        aerodrome = aerodromes.find((a) => a.name === AerodromeName.UUWW)
        break
      case AerodromeName.UUEE:
        aerodrome = aerodromes.find((a) => a.name === AerodromeName.UUEE)
        break
      default:
        throw new Error()
    }

    if (!aerodrome) {
      return []
    }

    let routes: ICanvasRoute[] | undefined

    switch (selectedRouteType.value) {
      case RouteType.SID:
        routes = aerodrome.SIDs
        break
      case RouteType.STAR:
        routes = aerodrome.STARs
        break
      default:
        throw new Error()
    }

    if (selectedRoute.value) {
      const ifAerodromesMatch = selectedRoute.value.aerodromeId === aerodrome.id
      const ifRouteTypesMatch = selectedRoute.value.type === selectedRouteType.value
      const ifRouteCategoriesMatch =
        ifSelectedRouteStandard.value === selectedRoute.value.ifStandard
      if (ifRouteCategoriesMatch && ifAerodromesMatch && ifRouteTypesMatch) {
        return [...routes, selectedRoute.value]
      }
    }

    return routes
  }

  function setSelectedRoute(route: ICanvasRoute) {
    if (!canvasPropertiesState.standardRoutes || !canvasPropertiesState.customRoutes) {
      throw new Error('Error setting route, standard or custom routes are undefined!')
    }

    if (!selectedRoute.value) {
      selectedRoute.value = route
      findAndRemoveRoute(
        route,
        canvasPropertiesState.standardRoutes,
        canvasPropertiesState.customRoutes,
      )
      conflictPoints.value = calculateConflictPoints(selectedRoute.value, getRoutes())
      return
    }

    if (selectedRoute.value.id === route.id) {
      return
    }

    conflictPoints.value = calculateConflictPoints(selectedRoute.value, getRoutes())
    findAndAddRoute(
      selectedRoute.value,
      canvasPropertiesState.standardRoutes,
      canvasPropertiesState.customRoutes,
    )
    selectedRoute.value = route
    findAndRemoveRoute(
      route,
      canvasPropertiesState.standardRoutes,
      canvasPropertiesState.customRoutes,
    )
  }

  function updatePoint(point: CanvasPoint, x: number, y: number) {
    point.x = x
    point.y = y

    conflictPoints.value = calculateConflictPoints(selectedRoute.value, getRoutes())

    const denormalized = denormalizeCartesianCoordinates(x, y, np.value!, width.value, height.value)
    const newGeographicCoordinates = convertCartesianToGeographic(
      denormalized,
      canvasPropertiesState.deviation,
      canvasPropertiesState.originPoint as RoutePoint_,
    )

    point.calculateNewGeographicCoordinates(newGeographicCoordinates)
  }

  function getAerodromeNames() {
    return Object.values(AerodromeName)
  }

  function setAerodromeName(a: string) {
    if (selectedRoute.value) {
      findAndAddRoute(selectedRoute.value, standardRoutes.value, customRoutes.value)
      selectedRoute.value = null
    }
    switch (a) {
      case AerodromeName.UUWW:
        selectedAerodromeName.value = AerodromeName.UUWW
        break
      case AerodromeName.UUEE:
        selectedAerodromeName.value = AerodromeName.UUEE
        break
      case AerodromeName.UUDD:
        selectedAerodromeName.value = AerodromeName.UUDD
        break
      default:
        throw new Error(`Type "${a}" does not match any aerodrome type!`)
    }
  }

  function getRouteTypes(): string[] {
    return Object.values(RouteType)
  }

  function setRouteType(t: string) {
    if (selectedRoute.value) {
      findAndAddRoute(selectedRoute.value, standardRoutes.value, customRoutes.value)
      selectedRoute.value = null
    }
    switch (t) {
      case RouteType.SID:
        selectedRouteType.value = RouteType.SID
        break
      case RouteType.STAR:
        selectedRouteType.value = RouteType.STAR
        break
      default:
        throw new Error(`Type "${t}" does not match any route type!`)
    }
  }

  function setRouteCategory(c: boolean) {
    if (selectedRoute.value) {
      findAndAddRoute(selectedRoute.value, standardRoutes.value, customRoutes.value)
      selectedRoute.value = null
    }
    ifSelectedRouteStandard.value = c
  }

  const width = computed(() => {
    if (canvasPropertiesState.width <= 0) {
      throw new Error('Canvas width is set to zero!')
    }

    return canvasPropertiesState.width
  })

  const height = computed(() => {
    if (canvasPropertiesState.height <= 0) {
      throw new Error('Canvas height is set to zero!')
    }

    return canvasPropertiesState.height
  })

  const customRoutes = computed(() => {
    if (!canvasPropertiesState.customRoutes) {
      throw new Error('Custom routes are undefined!')
    }

    return canvasPropertiesState.customRoutes
  })

  const standardRoutes = computed(() => {
    if (!canvasPropertiesState.standardRoutes) {
      throw new Error('Standard routes are undefined!')
    }

    return canvasPropertiesState.standardRoutes
  })

  const selectedRouteVisuals = computed(() => {
    if (!canvasPropertiesState.selectedRouteVisuals) {
      throw new Error('Selected route visuals are undefined!')
    }

    return canvasPropertiesState.selectedRouteVisuals
  })

  const conflictPointVisuals = computed(() => {
    if (!canvasPropertiesState.conflictPointVisuals) {
      throw new Error('Conflict point visuals are undefined!')
    }

    return canvasPropertiesState.conflictPointVisuals
  })

  function getRoutes(): ICanvasRoute[] {
    const allStandard = standardRoutes.value.flatMap((aerodromes) =>
      aerodromes.SIDs.concat(aerodromes.STARs),
    )
    const allCustom = customRoutes.value.flatMap((aerodromes) =>
      aerodromes.SIDs.concat(aerodromes.STARs),
    )
    return allStandard.concat(allCustom)
  }

  return {
    width,
    height,
    customRoutes,
    standardRoutes,
    selectedAerodromeName,
    selectedRoute,
    selectedRouteVisuals,
    conflictPointVisuals,
    ifSelectedRouteStandard,
    selectedRouteType,
    conflictPoints,
    init,
    getRoutes,
    setSelectedRoute,
    getRoutesForSelection,
    updatePoint,
    setRouteCategory,
    getRouteTypes,
    setRouteType,
    setAerodromeName,
    getAerodromeNames,
  }
})

function calculateConflictPoints(
  selectedRoute: ICanvasRoute | undefined | null,
  routes: ICanvasRoute[],
): IConflictPoint[] {
  if (!selectedRoute) {
    throw new Error("Can't find intersections if no route is selected!")
  }

  return findConflictPoints(selectedRoute, routes)
}

function findAndAddRoute(
  route: ICanvasRoute,
  standardRoutes: ICanvasAerodrome[],
  customRoutes: ICanvasAerodrome[],
) {
  findRoutesListForRoute(route, standardRoutes, customRoutes).push(route)
}

function findAndRemoveRoute(
  route: ICanvasRoute,
  standardRoutes: ICanvasAerodrome[],
  customRoutes: ICanvasAerodrome[],
) {
  const routes = findRoutesListForRoute(route, standardRoutes, customRoutes)
  const index = routes.findIndex((r) => r.id === route.id)
  if (index < 0) {
    throw new Error(`Can't find route "${route.name}" to remove from route list!`)
  }

  routes.splice(index, 1)
}

function findRoutesListForRoute(
  route: ICanvasRoute,
  standardRoutes: ICanvasAerodrome[],
  customRoutes: ICanvasAerodrome[],
) {
  const aerodromes = route.ifStandard ? standardRoutes : customRoutes
  const aerodrome = aerodromes.find((a) => a.id === route.aerodromeId)

  if (!aerodrome) {
    throw new Error(`Can't find aerodrome for route "${route.name}"`)
  }

  const routes = route.type === RouteType.SID ? aerodrome.SIDs : aerodrome.STARs

  return routes
}

function normalizePoints(
  routes: ICanvasAerodrome[],
  width: number,
  height: number,
): INormalizationParameters {
  const allPoints = routes
    .flatMap((aerodrome) => aerodrome.SIDs.concat(aerodrome.STARs))
    .flatMap((route) => route.points)

  const cartesianPoints = allPoints.map((point) => {
    return { x: point.x, y: point.y } as ICartesianPoint
  })

  const np = calculateNormalizationParameters(cartesianPoints, width, height)

  allPoints.forEach((point) => {
    point.x = point.x / np.scale + width / 2
    point.y = point.y / np.scale + height / 2
  })

  return np
}

function filterStandardRoutesIfHaveCustomRoute(
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
function makeCanvasRoutes(
  aerodromes: IAerodrome[],
  ifStandard: boolean,
  originPoint: RoutePoint_,
  deviation: number,
): ICanvasAerodrome[] {
  const canvasAerodromes = aerodromes.map((a): ICanvasAerodrome => {
    const SIDs = a.SIDs.map((SID) => makeCanvasRoute(SID, ifStandard, originPoint, deviation))

    const STARs = a.STARs.map((STAR) => makeCanvasRoute(STAR, ifStandard, originPoint, deviation))
    return {
      id: a.id,
      name: a.name,
      SIDs: SIDs,
      STARs: STARs,
    }
  })
  return canvasAerodromes
}

function makeCanvasRoute(
  route: IRoute,
  ifStandard: boolean,
  originPoint: RoutePoint_,
  deviation: number,
): ICanvasRoute {
  const points: RoutePoint_[] = route.points.map(
    (point) => new RoutePoint_(point.name, point.altitude, point.latitude, point.longitude),
  )

  setBearingAndDistanceForAllPoints(originPoint, points, deviation)
  setCartesianPoints(points)

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

function setBearingAndDistanceForAllPoints(
  originCoordinate: RoutePoint_,
  points: RoutePoint_[],
  deviation: number,
) {
  return points.forEach((point) =>
    point.setBearingAndDistance(calculateBearingAndDistance(originCoordinate, point, deviation)),
  )
}

function setCartesianPoints(points: RoutePoint_[]) {
  points.forEach((point) => {
    if (!point.bearingAndDistance) {
      throw new Error(`Point ${point.name} doesn't have bearing and distance!`)
    }

    point.setCartesianPoint(calculateCartesianCoordinate(point.bearingAndDistance))
  })
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
