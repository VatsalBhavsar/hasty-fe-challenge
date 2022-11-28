import { useEffect, useState, useRef, useCallback } from "react";
import { getCoordinateRangePoints } from "../../utils/utils";
import "./Canvas.css";
import {
  coordinateArea,
  coordinateRange,
  INVALID_POLYGON_MSG,
} from "./constants";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ICoordinates } from "../store/Workspace/Workspace.types";
import { message } from "antd";

interface ICanvas {
  width: number;
  height: number;
  id: string;
  updatePolygons: Function;
}

const Canvas = ({ width = 800, height = 500, id, updatePolygons }: ICanvas) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<any>(null);
  const [coordinates, setCoordinates] = useState<ICoordinates[]>([]);
  const [zoom, setZoom] = useState(1);
  const { canvases } = useSelector((state: RootState) => state);
  const {
    [id]: { polygons },
  } = canvases;

  const refreshCanvas = () => {
    context.clearRect(0, 0, width, height);
    drawPolygons();
  };

  const draw = () => {
    refreshCanvas();
    if (coordinates.length > 1) {
      context.setLineDash([2, 4]);
      const firstPointRangeX = getCoordinateRangePoints(
        coordinates[0].x,
        coordinateRange
      );
      const firstPointRangeY = getCoordinateRangePoints(
        coordinates[0].y,
        coordinateRange
      );

      context.beginPath();
      for (let i = 0; i < coordinates.length; i++) {
        if (i === 0) {
          context.moveTo(coordinates[i].x, coordinates[i].y);
        } else {
          if (
            firstPointRangeX.includes(coordinates[i].x) &&
            firstPointRangeY.includes(coordinates[i].y)
          ) {
            if (i < 3) {
              message.info(INVALID_POLYGON_MSG);
              let updatedCoordinates = [...coordinates];
              updatedCoordinates.pop();
              setCoordinates(updatedCoordinates);
              break;
            } else {
              updatePolygons(id, [...polygons, coordinates]);
              setCoordinates([]);
              break;
            }
          }
          context.lineTo(coordinates[i].x, coordinates[i].y);
        }
      }
      context.stroke();
    }

    for (let i = 0; i < coordinates.length; i++) {
      context.setLineDash([0, 0]);
      context.beginPath();
      context.rect(
        coordinates[i].x - coordinateRange,
        coordinates[i].y - coordinateRange,
        coordinateArea,
        coordinateArea
      );
      context.stroke();
    }
  };

  const drawPolygons = () => {
    if (!polygons.length || !context) return;
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.scale(zoom, zoom);
    context.translate(-width / 2, -height / 2);
    polygons.forEach((polygon) => {
      context.setLineDash([0, 0]);
      context.beginPath();
      for (let i = 0; i < polygon.length - 1; i++) {
        if (i === 0) {
          context.moveTo(polygon[i].x, polygon[i].y);
        } else {
          context.lineTo(polygon[i].x, polygon[i].y);
        }
      }
      context.closePath();
      context.stroke();
      for (let i = 0; i < polygon.length - 1; i++) {
        context.beginPath();
        context.rect(
          polygon[i].x - coordinateRange,
          polygon[i].y - coordinateRange,
          coordinateArea,
          coordinateArea
        );
        context.stroke();
      }
    });
    context.restore();
  };

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      const { code, ctrlKey } = e;
      if (code === "KeyZ" && ctrlKey) {
        let updatedCoordinates = [...coordinates];
        updatedCoordinates.pop();
        setCoordinates(updatedCoordinates);
      }
    },
    [coordinates]
  );

  useEffect(() => {
    if (canvasRef.current) {
      setContext(canvasRef.current?.getContext("2d"));
      if (context) {
        if (coordinates.length) {
          draw();
        } else {
          refreshCanvas();
        }
      }
    }
  }, [coordinates]);

  useEffect(() => {
    drawPolygons();
  }, [polygons, zoom, context]);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  const handleMouseUp = (e: any) => {
    const { button } = e;
    if (button !== 0) return;
    setCoordinates([
      ...coordinates,
      { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  const handleWheel = (e: any) => {
    const { deltaY = 0 } = e;
    setZoom(zoom + deltaY * 0.0005);
  };

  return (
    <canvas
      className="canvas"
      ref={canvasRef}
      height={height}
      width={width}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    />
  );
};

export default Canvas;
