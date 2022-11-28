import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { Tabs } from "antd";
import {
  addTab,
  setActiveTab,
  updateCanvas,
} from "../store/Workspace/Workspace.actions";
import { ICanvases, ITab } from "../store/Workspace/Workspace.types";
import Workspace from "../Workspace/Workspace";
import { parse, stringify } from "flatted";

const uniqid = require("uniqid");

const WorkspaceContainer = () => {
  const { tabs, activeTab } = useSelector((state: RootState) => state);
  const [tabItems, setTabItems] = useState<ITab[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!tabs.length) add();
  }, []);

  const add = () => {
    const tabId = uniqid();
    const newActiveKey = tabId;
    const newPanes = [...tabs];
    newPanes.push({
      label: "New Tab",
      children: null,
      key: newActiveKey,
    });
    dispatch(addTab(newPanes.filter((item) => item !== undefined)));
    dispatch(setActiveTab(newActiveKey));
    dispatch(updateCanvas(tabId, { polygons: [] }));
  };

  const updatePolygons = (id: string, polygons: ICanvases) => {
    dispatch(updateCanvas(id, { polygons }));
  };

  const onChange = (newActiveKey: string) => {
    dispatch(setActiveTab(newActiveKey));
  };

  const remove = (targetKey: string) => {
    if (tabs.length <= 1) return;
    let newActiveKey = activeTab;
    let lastIndex = -1;
    tabs.forEach((tab: ITab, i: number) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabs.filter((tab: ITab) => tab.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    dispatch(addTab(newPanes));
    dispatch(setActiveTab(newActiveKey));
  };

  const onEdit = (targetKey: any, action: "add" | "remove") => {
    action === "add" ? add() : remove(targetKey);
  };

  useEffect(() => {
    const a = parse(stringify(tabs));
    if (a.length) {
      setTabItems(
        a.map((item: ITab) => {
          item.children = (
            <Workspace id={item.key} updatePolygons={updatePolygons} />
          );
          return item;
        })
      );
    }
  }, [tabs]);

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeTab}
      onEdit={onEdit}
      items={tabItems}
    />
  );
};

export default WorkspaceContainer;
