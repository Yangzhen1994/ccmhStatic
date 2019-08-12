/**
 * Created by liyang on 2018/12/26.
 * 网络请求工具
 * @file
 * @author liyang
 * @version 1.0.0
 */
(function (name, definition) {
    if (typeof define === 'function') {
        // AMD环境或CMD环境
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // import axios from 'axios'
        // 定义为普通Node模块
        module.exports = definition(axios);
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        this[name] = definition(axios);
    }
})('lhRequest', function (axios) {
    // var isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);//判断是否是ios
    // var isoVersion = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/)[2].replace(/_/g, '.');//取出ios版本号

    // 创建axios实例
    const _service = axios.create({
        //   baseURL: 'http://123.56.28.198:8881',
        baseURL: 'http://' + window.location.host + '/api',
        timeout: 10000, // 请求超时时间
        // headers: { "Content-type": "application/json; charset=utf-8"}
        headers: { "Content-Type": " multipart/form-data" },
        // `adapter` 允许自定义处理请求，以使测试更轻松
        // 返回一个 promise 并应用一个有效的响应 (查阅 [response docs](#response-api)).
        // adapter: function (config) {
        //     /* ... */
        //     console.log('config', config)
        // },

    })
    var list = ['/login', '/logout', '/sso/login', '/sso/url']// 权限白名单
    // // request拦截器
    _service.interceptors.request.use(
        function (config) {
            var token = sessionStorage.getItem('token');
            if (!token) {//todo token验证不严谨，后台30分钟后token过期i，应该再请求一次对token做校验
                if (list.indexOf(config.url) < 0) {
                    lyTool.alert('用户未登录', function () {
                        window.location.href = "../login/login.html";
                    }, function () {
                        window.location.href = "../login/login.html";
                    })
                    return;
                }
            }
            if (config.url.indexOf('?') > -1) {
                config.url = config.url + '&cache=' + (Math.floor(Math.random() * 24))
            } else {
                config.url = config.url + '?cache=' + (Math.floor(Math.random() * 24))
            }
            config.headers['auth-token'] = token
            var method = config.method;
            if (method === 'POST' || method === 'post') {
                var data = config.data
                var formData = new FormData();
                for (var k in data) {
                    formData.append(k, data[k]);
                }
                config.data = formData
            }
            return config
        },
        function (error) {
            console.log(error)
        }
    )
    var codeList = {
        '400': '请求参数不对',
        '404': '请求地址不对',
        '401': '访问被拒绝',
        '500': '数据出错',
        '4011': '账号密码错误',
        // '10001': '只能删除内容为空的目录!'
    }
    // 添加响应拦截器
    _service.interceptors.response.use(function (response) {
        // 解析错误码
        // console.log('response-------', response)
        // $("#myAlert2").alert();
        var data = response.data
        var code = data.code;
        if (code == 200) {

        }
        else if (code === 401) {
            lyTool.alert('用户未登录', function () {
                window.location.href = "../login/login.html";
            }, function () {
                window.location.href = "../login/login.html";
            })
        } else {
            // var str = codeList[code];
            // str && lyTool.toast(str)
            if (data.message) {
                lyTool.toast(data.message)
            }
        }
        return response;
    }, function (error) {
        var response = error.response;
        lyTool.toast('服务器错误请稍后重试')
        lyTool.hideloading()
        return Promise.reject(error);
    });
    _api.service = serviceProxy
    return _api
})
