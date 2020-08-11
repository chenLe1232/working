import qs from 'qs';
import fetch from 'isomorphic-fetch';

const handleResponse = (response) => {
  if (response.ok) {
    return response.json().then((result) => {
      if ('code' in result) {
        if (result.code === 0) {
          return 'data' in result ? result.data : result;
        } else {
          // code 不为0时候，通过toast显示server异常信息
          // store.dispatch(ToastAction.openToast(result.msg, 'failed'));
        }
        return Promise.reject(result);
      }
      return result;
    });
  }
  return response.json().then((error) => new Error(error));
};

export const get = (url, query = {}) => fetch(url + qs.stringify(query, { addQueryPrefix: true }), {
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}).then((response) => handleResponse(response));

export const post = (url, params = {}) => fetch(url, {
  method: 'POST',
  body: JSON.stringify(params),
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}).then((response) => handleResponse(response));
