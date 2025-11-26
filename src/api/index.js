import { get, post, toQueryString } from "./configRequest";

const LOGIN = async (options) => {
  let url = "/auth/login";
  return await post(url, options);
};

const QUERY_CURRENT_ADMIN = async (options) => {
  let url = "/user/getUser";
  return await get(url, options);
};

const QUERY_PRODUCTS = async (options, params = {}) => {
  let url = "/product";
  if (Object.keys(params).length > 0) {
    url += `${toQueryString(params, true)}`;
  }
  return await get(url, options);
};

const QUERY_CURRRENT_PRODUCT = async (options) => {
  let url = "/product/getById/" + options.id;
  return await get(url, options);
};

const QUERY_CATEGORIES = async (options, params = {}) => {
  let url = "/category";
  if (Object.keys(params).length > 0) {
    url += `${toQueryString(params, true)}`;
  }
  return await get(url, options);
};

const QUERY_CURRRENT_CATEGORY = async (options) => {
  let url = "/category/getById/" + options.id;
  return await get(url, options);
};

const DELETE_CATEGORY = async (id) => {
  let url = "/category/delete/" + id;
  return await post(url);
};

const ADD_CATEGORY = async (options) => {
  let url = "/category/saveOrUpdate";
  return await post(url, options);
};

const QUERY_USERS = async (options, params = {}) => {
  let url = "/user/getUsers";
  if (Object.keys(params).length > 0) {
    url += `${toQueryString(params, true)}`;
  }
  return await get(url, options);
};

const ADD_USER = async (data) => {
  let url = "/auth/addUser";
  return await post(url, data);
};

const QUERY_CURRRENT_USER = async (options) => {
  let url = "/user/getById/" + options.id;
  return await get(url, options);
};

const ADD_PRODUCT = async (data) => {
  let url = "/product/saveOrUpdate";
  return await post(url, data);
};

const ADD_ORDER = async (data) => {
  let url = "/order/saveOrUpdate";
  return await post(url, data);
};

const DELETE_PRODUCT = async (id) => {
  let url = "/product/delete/" + id;
  return await post(url);
};

const DELETE_ORDER = async (id) => {
  let url = "/order/delete/" + id;
  return await post(url);
};

const GET_ALL_ROLE = async () => {
  let url = "/role";
  return await get(url);
};

const QUERY_ORDERS = async (options, params = {}) => {
  let url = "/order";
  if (Object.keys(params).length > 0) {
    url += `${toQueryString(params, true)}`;
  }
  return await get(url, options);
};

const QUERY_CURRENT_ORDER = async (options) => {
  let url = "/order/getById/" + options.id;
  return await get(url, options);
};

export {
  LOGIN,
  QUERY_PRODUCTS,
  QUERY_CATEGORIES,
  QUERY_USERS,
  QUERY_CURRRENT_CATEGORY,
  ADD_CATEGORY,
  QUERY_CURRRENT_PRODUCT,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  QUERY_CURRENT_ADMIN,
  DELETE_CATEGORY,
  ADD_USER,
  QUERY_CURRRENT_USER,
  GET_ALL_ROLE,
  QUERY_ORDERS,
  QUERY_CURRENT_ORDER,
  ADD_ORDER,
  DELETE_ORDER,
};
