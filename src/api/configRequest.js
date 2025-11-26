import { notification } from 'antd';

const flatten = (obj, path = []) => {
  let result = [];
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) return;
    let newPath = path.slice();
    newPath.push(key);
    let everyPath = [];
    if (typeof obj[key] === 'object') {
      everyPath = flatten(obj[key], newPath);
    } else {
      everyPath.push({
        path: newPath,
        val: obj[key],
      });
    }
    everyPath.forEach((item) => result.push(item));
  }

  return result;
};

const asyncLocalStorage = {
  setItem: async function (key, value) {
    await null;
    return localStorage.setItem(key, value);
  },
  getItem: async function (key) {
    await null;
    return localStorage.getItem(key);
  },
};

const compose = (paths) => {
  let result = '';
  paths.forEach((item) => {
    let pathString =
      item.path.length > 1
        ? item.path.reduce((a, b) => {
            return a + '[' + b + ']';
          })
        : item.path[0];

    pathString = (result ? '&' : '?') + pathString + '=' + item.val;
    result += pathString;
  });

  return result;
};

function toQueryString(obj, encode) {
  const str = compose(flatten(obj));
  return encode === true ? encodeURI(str) : str;
}

// console.log('... tsting ');
// console.log(toQueryString({ current: 1, pageSize: 1 }));
// console.log(toQueryString({ pagination: { current: 1, pageSize: 10 } }));

const ROOT = process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:8080';

const SERVER_PUBLIC_FOLDER = ROOT + '';

const handleGetToken = async () => {
  const tokenAsync = await asyncLocalStorage.getItem('bsatk');
  return tokenAsync;
};

const STATUS_CODE = {
  UNAUTHENTICATE: 401,
};
//-- -- -- -- -- -- -- -- -- -- -- -- -- Utils -- -- -- -- -- -- -- -- -- -- -- //
let defaultOptions = {
  mode: 'cors',
  headers: {
    Accept: 'application/json',
  },
};

const parseRes = async (response) => {
  let responseOK = response && response.ok;
  if (responseOK) {
    let res = await response.json();
    return res;
  }

  return null;
};

const messageReg = {
  USER_NOT_FOUND: /user is not found/g,
  WRONG_PASSWORD: /wrong password/g,
  EMAIL_IS_EXISTS: /email is already exist/g,
  WRONG_EMAIL_OR_PASSWORD: /wrong email or password/g,
  FILE_DELETE: /Could not delete the file!/g,
  FILE_UPLOAD: /Could not upload the file!/g,
  FIND_CATEGORY: /can't find category/g,
  DELETE_CATEGORY: /can not delete category/g,
  SAVE_CATEGORY: /can not save or update category/g,
  FIND_ORDER: /can't find order/g,
  DELETE_ORDER: /can not delete order/g,
  SAVE_ORDER: /can not save or update order/g,
  FIND_PRODUCT: /can't find product/g,
  DELETE_PRODUCT: /can not delete product/g,
  SAVE_PRODUCT: /can not save or update product/g,
  FIND_SIZE: /can't find size/g,
  DELETE_SIZE: /can not delete size/g,
  UPDATE_SIZE: /can not save or update size/g,
  DELETE_BANNER: /can not delete banner/g,
  SAVE_BANNER: /can not save or update banner/g,
  PERMISSION_DENIED: /permission denied/g,
  EMAIL_IS_INVALID: /email is invalid/g,
  PHONE_IS_INVALID: /phone is invalid/g,
  EMAIL_IS_BLANK: /Email không được bỏ trống/g,
  PASSWORD_IS_BLANK: /Password không được bỏ trống/g,
};

export const errorMessages = {
  DEFAULT: 'The unexpected error has occur, Please try again!',
  USER_NOT_FOUND: 'Invalid user. Please try again!',
  WRONG_PASSWORD: 'Wrong password. Please try again!',
  EMAIL_IS_EXISTS: 'Email is already exist!',
  WRONG_EMAIL_OR_PASSWORD: 'Wrong email or password!',
  FILE_DELETE: 'Không thể xóa file!',
  FILE_UPLOAD: 'Không thể upload file!',
  FIND_CATEGORY: 'Không tìm thấy danh mục sản phẩm!',
  DELETE_CATEGORY: 'Không thể xóa danh mục sản phẩm!',
  SAVE_CATEGORY: 'Không thể thêm / cập nhật danh mục sản phẩm!',
  FIND_ORDER: 'Không tìm thấy đơn hàng!',
  DELETE_ORDER: 'Không thể xóa đơn hàng!',
  SAVE_ORDER: 'Không thể thêm / cập nhật đơn hàng!',
  FIND_PRODUCT: 'Không tìm thấy sản phẩm!',
  DELETE_PRODUCT: 'Không thể xóa sản phẩm!',
  SAVE_PRODUCT: 'Không thể thêm / cập nhật sản phẩm!',
  FIND_SIZE: 'Không tìm thấy size!',
  DELETE_SIZE: 'Không thể xóa size!',
  UPDATE_SIZE: 'Không thể thêm / cập nhật size!',
  DELETE_BANNER: 'Không thể xoá banner!',
  SAVE_BANNER: 'Không thể thêm / cập nhật banner!',
  PERMISSION_DENIED: 'Permission denied!',
  EMAIL_IS_INVALID: 'Invalid email!',
  PHONE_IS_INVALID: 'Invalid phone!',
  EMAIL_IS_BLANK: 'Email can not be blank!',
  PASSWORD_IS_BLANK: 'Password can not be blank!',
};

const errorMessageKeys = Object.keys(messageReg);

export const parseError = (message) => {
  const errorKey = errorMessageKeys.find((key) => message.match(messageReg[key]));
  if (errorKey) return errorMessages[errorKey];

  return errorMessages['DEFAULT'];
};

const [post, del, put] = ['post', 'delete', 'put'].map(
  (k) =>
    async (url, options, baseUrl = ROOT, parse = parseRes) => {
      let data = { ...options };
      if (data['body']) {
        data['body'] = JSON.stringify(data['body']);
      }

      let response = await fetch(baseUrl + url, {
        ...data,
        method: k,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${await handleGetToken()}`,
        },
      });

      console.log(response.status);

      if (response.status === STATUS_CODE.UNAUTHENTICATE) {
        if (window.location.href.indexOf('/login') !== -1) {
          let res = await response.json();
          const errorMessage = parseError(res?.message);
          return notification.open({
            message: errorMessage,
            placement: 'bottomRight',
          });
        }
        window.location.href = '/login';
        return;
      }
      return parse(response);
    }
);

const get = async (url, options) => {
  let response = await fetch(ROOT + url, {
    ...defaultOptions,
    ...options,
    headers: { Authorization: `Bearer ${await handleGetToken()}` },
    method: 'GET',
  });

  if (response.status === STATUS_CODE.UNAUTHENTICATE) {
    window.location.href = '/login';
    return;
  }

  return parseRes(response);
};
export { get, post, put, del, SERVER_PUBLIC_FOLDER, ROOT, STATUS_CODE, toQueryString };
