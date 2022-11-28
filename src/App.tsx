import { FC } from "react";
import { Provider } from "react-redux";
import "antd/dist/reset.css";
import "./App.css";
import WorkspaceContainer from "./components/WorkspaceContainer/WorkspaceContainer";
import store, { persistor } from "./components/store/store";
import { PersistGate } from "redux-persist/integration/react";

const App: FC = () => (
  <Provider store={store}>
    <div className="App">
      <PersistGate loading={null} persistor={persistor}>
        <WorkspaceContainer />
      </PersistGate>
    </div>
  </Provider>
);

export default App;
