import type IVisual from './IVisual'

export default interface ITextVisual extends IVisual {
  font: string
  xOffset: number
  yOffset: number
}
