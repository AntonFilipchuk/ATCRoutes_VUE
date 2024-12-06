export default function convertToDMSFormat(geographicCoordinate: {
  latitudeDegrees: number
  longitudeDegrees: number
}): { latitude: string; longitude: string } {
  function toDMS(degrees: number, isLatitude: boolean): string {
    const absoluteDegrees = Math.abs(degrees)

    // Extract degrees, minutes, and seconds
    const d = Math.floor(absoluteDegrees)
    const minutesFull = (absoluteDegrees - d) * 60
    const m = Math.floor(minutesFull)
    const s = (minutesFull - m) * 60

    // Format to "DDMMSS.SS" with direction
    const direction = isLatitude
      ? degrees >= 0
        ? 'N'
        : 'S' // North or South
      : degrees >= 0
        ? 'E'
        : 'W' // East or West

    return `${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${s.toFixed(2).padStart(5, '0')}${direction}`
  }

  const latitudeDMS = toDMS(geographicCoordinate.latitudeDegrees, true)
  const longitudeDMS = toDMS(geographicCoordinate.longitudeDegrees, false)

  return { latitude: latitudeDMS, longitude: longitudeDMS }
}
