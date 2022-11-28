import { configureStore } from "@reduxjs/toolkit";
import WorkspaceReducer from "./Workspace/Workspace.reducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createTransform } from "redux-persist";
import { parse, stringify } from "flatted";

const SetTransform = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState)
);

const persistConfig = {
  key: "root",
  storage,
  transforms: [SetTransform],
};

const persistedReducer = persistReducer(persistConfig, WorkspaceReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export const persistor = persistStore(store);
