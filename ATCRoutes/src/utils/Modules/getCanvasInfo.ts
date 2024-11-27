export default function getCanvasInfo(canvas: HTMLCanvasElement | undefined | null) {
  if (!canvas) {
    throw new Error("Can't find canvas element!")
  }

  if (!(canvas instanceof HTMLCanvasElement)) {
    console.log(canvas)

    throw new Error('Element is not a HTMLCanvasElement!')
  }

  const canvasContext = canvas.getContext('2d')

  if (!canvasContext) {
    throw new Error("Can't access canvas context!")
  }

  return { canvas: canvas, canvasContext: canvasContext }
}

export function setCanvasDimensions(
  canvasContext: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  canvasContext.canvas.width = width
  canvasContext.canvas.height = height
}
