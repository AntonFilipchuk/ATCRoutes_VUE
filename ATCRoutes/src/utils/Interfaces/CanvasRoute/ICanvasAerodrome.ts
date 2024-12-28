import type ICanvasRoute from './ICanvasRoute'

export interface ICanvasAerodrome {
  id: string
  name: string
  SIDs: ICanvasRoute[]
  STARs: ICanvasRoute[]
}
