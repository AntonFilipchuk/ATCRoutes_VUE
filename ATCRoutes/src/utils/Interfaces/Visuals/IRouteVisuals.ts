import type ITextVisual from './ITextVisual'
import type IVisual from './IVisual'

export default interface IRouteVisuals {
  lineVisuals: IVisual
  ifShowLines: boolean

  pointVisuals: IVisual
  ifShowPoints: boolean

  textVisuals: ITextVisual
  ifShowText: boolean
}
