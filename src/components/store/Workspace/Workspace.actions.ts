import {
  ADD_TAB,
  REMOVE_TAB,
  SET_ACTIVE_TAB,
  UPDATE_CANVAS,
} from "./Workspace.types";

export const addTab = (tabs: any) => ({
  type: ADD_TAB,
  tabs,
});

export const revmoeTab = (tabs: any) => ({
  type: REMOVE_TAB,
  tabs,
});

export const setActiveTab = (key: string) => ({
  type: SET_ACTIVE_TAB,
  key,
});

export const updateCanvas = (key: string, payload: any) => ({
  type: UPDATE_CANVAS,
  key,
  payload,
});
