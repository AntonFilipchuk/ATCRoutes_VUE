import type CanvasPoint from './CanvasRoute/CanvasPoint';
import type ICanvasRoute from './CanvasRoute/ICanvasRoute';

export interface IConflictPoint
{
  route1: ICanvasRoute;
  route2: ICanvasRoute;
  x: number;
  y: number;
  z: number[];
  section1: CanvasPoint[];
  section2: CanvasPoint[];
}

interface IConflict {
  
}
