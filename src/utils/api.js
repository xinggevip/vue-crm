import axios from 'axios'; // 引入axois模块
import QS from 'qs'; // 引入qs模块，用来序列化post类型数据
import {Message} from 'element-ui';


// 根据不同环境配置baseUrl
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://127.0.0.1:8080';
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = 'http://127.0.0.1:8080';
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://127.0.0.1:8080';
}

axios.defaults.timeout = 10000; // 请求超过10s，告知用户请求超时

// 定义错误信息
let ERR_MESSAGE = {
    "loginExpired":"登录已过期！请重新登录！！",
    "requestTimeout":"请求超时! 请检查网络或联系管理员！！",
    "serverErr":"服务器错误，请联系管理员！！"
}

// post请求的时候，需要加上一个请求头，所以可是设置一个默认设置，即post请求头如下
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; chartset=UTF-8';

// 先导入vuex，因为要使用里面的状态对象
// vuex的路径
import store from '@/store/index';

// 请求拦截
axios.interceptors.request.use(
    config => {
        return config;
    },

    error => {
        return Promise.error(error);
    },
);




// 响应拦截
axios.interceptors.response.use(
    response => {
        // 如果状态码为200，接口请求成功，否则抛出错误
        if (response.status === 200) {
            // console.log("来到了响应拦截");
            // console.log(response);

            if (response.data.code < 200 || response.data.code >= 400) {
                Message.error(response.data.message)
            }
            return Promise.resolve(response);
        } else {
            Message.error({message: ERR_MESSAGE.serverErr})
            return Promise.reject(response);
        }
    },
    // 可以跟后台的开发人员，协商好统一的错误状态码
    error => {
        Message.error({message: ERR_MESSAGE.serverErr})
        return Promise.reject(error.response);
    },
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            // console.log("来到了get响应");
            // console.log(res);
            if (res.data != null || res.data !=''){
                resolve(res.data);
            }
            resolve(res);
        }).catch(err => {
            reject(err);
        });
    });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */

//
export function postQs(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; chartset=UTF-8'
            }
        })
        .then(res => {
            // console.log("来到了postQs响应");
            // console.log(res);
            if (res.data != null || res.data !=''){
                resolve(res.data);
            }
            resolve(res);
            }).catch((err) => {

            reject(err);
        });

    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                // console.log("来到了post响应");
                // console.log(res);
                if (res.data != null || res.data !==''){
                    resolve(res.data);
                }
                resolve(res);
            }).catch((err) => {

                reject(err);
        });

    });
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(res => {
                // console.log("来到了post响应");
                // console.log(res);
                if (res.data != null || res.data !==''){
                    resolve(res.data);
                }
                resolve(res);
            }).catch((err) => {

                reject(err);
        });

    });
}



