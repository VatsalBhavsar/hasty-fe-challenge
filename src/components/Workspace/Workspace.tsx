import { useRef, useEffect, useState } from "react";
import Canvas from "../Canvas/Canvas";
import Statistics from "../Statistics/Statistics";
import "./Workspace.css";

interface IWorkspace {
  id: string;
  updatePolygons: Function;
}

const Workspace = ({ id, updatePolygons }: IWorkspace) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  useEffect(() => {
    setHeight(ref?.current?.clientHeight ? ref.current.clientHeight - 2 : 0);
    setWidth(ref?.current?.clientWidth || 0);
  }, []);
  return (
    <div className="workspace">
      <div ref={ref} className="canvas-container">
        <Canvas
          width={width}
          height={height}
          id={id}
          updatePolygons={updatePolygons}
        />
      </div>
      <Statistics id={id} updatePolygons={updatePolygons} />
    </div>
  );
};

export default Workspace;
