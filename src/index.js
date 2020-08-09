import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {PersistGate} from 'redux-persist/integration/react';
import './reset.css';
import './css/index.css';
import App from './App';
import {modeSelect} from './mySongStorage/MssStore';

// Redux Persistの設定
const persistConfig = {
  key: 'mss',
  storage,
  blacklist: ['mode', 'reasonCondition', 'displayResult', 'searchCondition', 'searchedSongs', 'finalResult', 'selectedSongId', 'selectedSongData', 'songDataMode', 'editReasonCondition'],
  whitelist: ['songStorage', 'reasonList']
}

const persistedReducer = persistReducer(persistConfig, modeSelect);

let store = createStore(persistedReducer);
let pstore = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<p>loading...</p>} persistor={pstore}>
      <App appName='My Song Storage' />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);