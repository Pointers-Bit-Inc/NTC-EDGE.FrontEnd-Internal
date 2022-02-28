import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'src/services/store';
import Navigation from 'src/navigations';
import TopModal from "@pages/activities/topmodal";


if(__DEV__) {
    import("./ReactotronConfig")
}

export default function App() {
    return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar />
        <Navigation />
      <TopModal/>
      </PersistGate>
    </Provider>
  );
}
