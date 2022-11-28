export const ADD_TAB = "ADD_TAB";
export const REMOVE_TAB = "REMOVE_TAB";
export const SET_ACTIVE_TAB = "SET_ACTIVE_TAB";
export const UPDATE_CANVAS = "UPDATE_CANVAS";

export interface ICoordinates {
  x: number;
  y: number;
}

export interface ICanvas {
  polygons: Array<ICoordinates[]>;
}

export interface ICanvases {
  [key: string]: ICanvas;
}

export interface ITab {
  label: string;
  children: any;
  key: string;
}

export interface IReducer {
  tabs: Array<ITab>;
  activeTab: string;
  canvases: ICanvases;
}
