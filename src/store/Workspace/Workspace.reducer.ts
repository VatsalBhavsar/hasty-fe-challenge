import {
  ADD_TAB,
  IReducer,
  REMOVE_TAB,
  SET_ACTIVE_TAB,
  UPDATE_CANVAS,
} from "./Workspace.types";

const initialState = {
  tabs: [],
  activeTab: "1",
  canvases: {},
};

const WorkspaceReducer = (state: IReducer = initialState, action: any) => {
  switch (action.type) {
    case ADD_TAB:
      return {
        ...state,
        tabs: action.tabs,
      };
    case REMOVE_TAB:
      return {
        ...state,
        tabs: action.tabs,
      };
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.key,
      };
    case UPDATE_CANVAS:
      return {
        ...state,
        canvases: {
          ...state.canvases,
          [action.key]: action.payload,
        },
      };
    default:
      return state;
  }
};

export default WorkspaceReducer;
