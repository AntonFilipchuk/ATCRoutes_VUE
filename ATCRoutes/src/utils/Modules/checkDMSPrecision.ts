import type IGeographicCoordinate from '../Interfaces/IGeographicCoordinate'

export default function checkDMSPrecision(
  coor1: IGeographicCoordinate,
  coor2: IGeographicCoordinate,
): string | null {
  const lat1 = coor1.latitude
  const lat2 = coor2.latitude
  const lon1 = coor1.longitude
  const lon2 = coor2.longitude

  const messages: string[] = []

  function checkLatitude(lat1: string, lat2: string): void {
    const deg1: number = +lat1.slice(0, 2)
    const deg2: number = +lat2.slice(0, 2)

    if (deg1 !== deg2) {
      messages.push(`Latitudes do not match by degrees! ${deg1} - ${deg2}`)
    }

    const mins1: number = +lat1.slice(2, 4)
    const mins2: number = +lat2.slice(2, 4)

    if (mins1 !== mins2) {
      messages.push(`Latitudes do not match by minutes! ${mins1} - ${mins2}`)
    }
  }

  function checkLongitude(lon1: string, lon2: string): void {
    // Handle leading zero
    if (lon1.charAt(0) === '0') {
      lon1 = lon1.substring(1)
    }
    if (lon2.charAt(0) === '0') {
      lon2 = lon2.substring(1)
    }

    const deg1: number = +lon1.slice(0, 2)
    const deg2: number = +lon2.slice(0, 2)

    if (deg1 !== deg2) {
      messages.push(`Longitudes do not match by degrees! ${deg1} - ${deg2}`)
    }

    const mins1: number = +lon1.slice(2, 4)
    const mins2: number = +lon2.slice(2, 4)

    if (mins1 !== mins2) {
      messages.push(`Longitudes do not match by minutes! ${mins1} - ${mins2}`)
    }
  }

  // Check latitude and longitude
  checkLatitude(lat1, lat2)
  checkLongitude(lon1, lon2)

  // If no messages, return null
  if (messages.length === 0) {
    return null
  }

  // Prepend coordinate name to the message
  return `Name: ${coor1.name}, LatOrig: ${coor1.latitude}, LatConverted: ${coor2.latitude} ${messages.join(' ')}`
}
