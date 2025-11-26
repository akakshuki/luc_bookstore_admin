import { call, put } from 'redux-saga/effects';

function* genericApiSaga({ completed, failed, gatewayCall }) {
  const response = yield call(gatewayCall);
  const payload = response.body;
  if (response.status === 200) {
    yield put(completed(payload));
  } else {
    yield put(failed(payload));
  }
}

export default genericApiSaga;
