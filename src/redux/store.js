import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import sagaMonitor from '@redux-saga/simple-saga-monitor';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducer';
import rootSagas from './saga';
// import { actionCreators as openViduActions } from './OpenVidu/openvidu.meta';

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middleware = [sagaMiddleware];

middleware.push(createLogger({ collapsed: true }));

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSagas);

export const actions = {};
