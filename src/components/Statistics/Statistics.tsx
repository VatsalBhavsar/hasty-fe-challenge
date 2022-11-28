import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Input, Collapse, Button, Upload, message } from "antd";
import type { UploadProps } from "antd/es/upload/interface";
import { ExportOutlined, ImportOutlined } from "@ant-design/icons";
import * as MESSAGES from "./constants";
import "./Statistics.css";

const { Panel } = Collapse;

interface IStatistics {
  id: string;
  updatePolygons: Function;
}

const Statistics = ({ id, updatePolygons }: IStatistics) => {
  const { canvases } = useSelector((state: RootState) => state);
  const {
    [id]: { polygons },
  } = canvases;

  const totalCoordinates = polygons.reduce((total, curr) => {
    return (total += curr.length - 1);
  }, 0);

  const props: UploadProps = {
    beforeUpload: (file) => {
      const fileReader: any = new FileReader();
      fileReader.onloadend = () => {
        try {
          const { data } = JSON.parse(fileReader.result);
          updatePolygons(id, [...polygons, ...data]);
        } catch (e) {
          console.log(MESSAGES.ERROR_READING_FILE);
        }
      };
      if (file !== undefined) fileReader.readAsText(file);
      return false;
    },
    showUploadList: false,
  };

  const exportData = () => {
    if (!polygons.length) {
      message.info(MESSAGES.NO_POLYGONS_MSG);
      return;
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ data: polygons })
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "polygons.json";

    link.click();
  };

  return (
    <div className="statistics">
      <Collapse defaultActiveKey={["0", "1"]} ghost>
        <Panel header="Actions" key="0">
          <div className="actions">
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={exportData}
            >
              Export
            </Button>
            <Upload {...props}>
              <Button icon={<ImportOutlined />}>Import</Button>
            </Upload>
          </div>
        </Panel>
        <Panel header="Statistics" key="1">
          <p>{`${MESSAGES.TOTAL_POLYGONS} ${polygons.length}`}</p>
          <p>{`${MESSAGES.TOTAL_COORDINATES} ${totalCoordinates}`}</p>
        </Panel>
        <Panel header="Coordinates" key="2">
          {polygons.length ? (
            polygons.map((polygon, i) => (
              <div key={i} className="polygon-list">
                <div className="label">{`Polygon ${i + 1}`}</div>
                {polygon.map((coordinates, i) => (
                  <div key={i} className="coordinates">
                    <Input
                      className="x-coordinate"
                      placeholder="x"
                      readOnly
                      value={coordinates.x}
                    />
                    <Input
                      className="y-coordinate"
                      placeholder="y"
                      readOnly
                      value={coordinates.y}
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>{MESSAGES.NO_COORDINATES_MSG}</p>
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default Statistics;
