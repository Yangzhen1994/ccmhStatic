var proxyMiddleWare = require('http-proxy-middleware');
var express = require('express');
const logger = require('morgan');
var app = express();
var proxyPath = "http://123.56.28.198:8882";//目标后端服务地址
//var proxyPath = "http://192.168.18.102:8080";//和苏总的调试地址
// http://123.56.28.198:8881
var proxyOption = {
    target: proxyPath,
    changeOrigoin: true,
    ws: true,
    pathRewrite: { '^/api': '/' }
};
app.use("/api",logger('dev'));
app.use(express.static(__dirname + "/src"));
app.use("/api", proxyMiddleWare(proxyOption));

app.get('/test', function (req, res) {
    res.download('src/js/api.js')
})
app.listen(8080);//是我要启动的端口
console.log('启动8080端口')