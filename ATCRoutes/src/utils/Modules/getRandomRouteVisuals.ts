import type IRouteVisuals from '../Interfaces/Visuals/IRouteVisuals'
import type ITextVisual from '../Interfaces/Visuals/ITextVisual'
import type IVisual from '../Interfaces/Visuals/IVisual'
import { getRandomColor } from './randomColorGenerator'

export default function getRandomRouteVisuals(): IRouteVisuals {
  const randomColor = getRandomColor()
  const lineVisuals: IVisual = {
    color: randomColor,
    ifStroke: true,
    strokeColor: 'black',
    strokeWidth: 2,
    width: 10,
  }
  const pointVisuals: IVisual = {
    color: randomColor,
    ifStroke: true,
    strokeColor: 'black',
    strokeWidth: 2,
    width: 20,
  }

  const textVisuals: ITextVisual = {
    color: 'white',
    ifStroke: true,
    strokeColor: 'black',
    strokeWidth: 6,
    width: 14,
    font: 'Arial',
    xOffset: 0,
    yOffset: 0,
  }
  return {
    ifShowLines: true,
    ifShowPoints: true,
    ifShowText: true,
    lineVisuals: lineVisuals,
    pointVisuals: pointVisuals,
    textVisuals: textVisuals,
  }
}
