import type ICartesianData from '../ICartesianData'

export default interface IRoutePoint {
  name: string
  altitude: string
  latitude: string
  longitude: string
  cartesianData: ICartesianData
}
