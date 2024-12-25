import type IRoute from './IRoute'

export default interface IAerodrome {
  id: string
  name: string
  STARs: IRoute[]
  SIDs: IRoute[]
}
