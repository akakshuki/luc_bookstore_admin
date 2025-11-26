import { all } from 'redux-saga/effects';
// import { createOpenViduSaga } from './OpenVidu/openvidu.saga';

export default function* root() {
  yield all([
    // createOpenViduSaga()
  ]);
}
