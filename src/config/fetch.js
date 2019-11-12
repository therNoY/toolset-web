import { baseUrl } from './env'
/**
 * 封装的发送请求的函数
 * vue Vue实例
 * url 发送的Url
 * data jsons数据
 * type 请求类型 目前有 POST 和 GET
 */
export default async (vue = null, url = '', data = {}, type = 'POST') => {
  type = type.toUpperCase();
  // 1.验证token 
  var token;
  // 拼接组成的请求地址
  url = baseUrl + url;
  // 如果是get请求
  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })
    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
    return new Promise((resolve, reject) => {
      vue.$http.get(url,
        {
          headers: { Authorization: "Bearer " + token }
        }
      )
        .then(function (response) {
          // 返回结果
          if (response.data.resCode == 40050 || response.data.resCode == 40051) {
            vue.$router.push('/');
            return;
          }
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    
  } else if (type == 'POST') {
    // 发送Post请求
    return new Promise((resolve, reject) => {
      vue.$http.post(url, data,
        {
          headers: { Authorization: "Bearer " + token }
        }
      )
        .then(function (response) {
          // 返回结果
          if (response.data.resCode == 40050 || response.data.resCode == 40050) {
            vue.$router.path("/");
            return;
          }
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
  }
}
