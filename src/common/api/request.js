import axios from 'axios'
import store from '../../store'
import { baseUrl } from './env'

import { Message } from 'element-ui';
// 黑名单
const balckList = ["/api/", "/admin/", "/root/"];

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
// 创建axios实例
const service = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {

  if (config.url.indexOf("/root/") >= 0 || config.url.indexOf("/api/") >= 0 || config.url.indexOf("/admin/") >= 0) {
    console.log("request 拦截 加token");
    console.log(store);
    if (store.getters.token) {
      config.headers['Authorization'] = "Bearer " + store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }else{
      console.error("无token 访问");
    }
  } 
  return config;
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    console.log("response拦截");
    if (response.data != null && response.data.resCode == '40003') {
      Message.error(response.data.resMes + " 请重新登录");
    }
    return response.data;
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

/**
 * 封装的发送请求的函数
 * vue Vue实例
 * url 发送的Url
 * data jsons数据
 * type 请求类型 目前有 POST 和 GET PUT DELETE
 */
export function request(url = '', data = {}, type = 'POST') {
  type = type.toUpperCase();
  if (type == 'GET') {
    console.log("get 类型请求");
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    return new Promise((resolve, reject) => {
      service.get(url, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  } else if (type == 'DELETE') {
    console.log("delete 类型请求");
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    return new Promise((resolve, reject) => {
      service.delete(url, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  } else if (type == 'POST') {
    console.log("post");
    return new Promise((resolve, reject) => {
      service.post(url, data, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  } else if (type == 'PUT') {
    console.log("put 请求");
    return new Promise((resolve, reject) => {
      service.put(url, data, {})
        .then(function (response) {
          // 返回结果
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    })
  }

}

