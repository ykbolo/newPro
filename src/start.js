const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
var url = require('url');
const express = require('express');
var querystring = require('querystring');// 引入 querystring 库，也是帮助解析用的
const app = express();
var http = require('http');
var marked = require('marked');

app.use(express.static('src'));  //加载静态文件

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/getMdFile', urlencodedParser, function (req, res) {
  var arg = url.parse(req.url).query;

  //将arg参数字符串反序列化为一个对象
  var params = querystring.parse(arg);
  console.log(params)
  var data = fs.readFileSync(`src/mds/${params.type}/${params.type}${params.id}.md`, 'utf-8');    //读取本地的md文件
  res.end(JSON.stringify({
    body: marked(data)
  }));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 服务开启后访问指定编译好的dist文件下的数据
app.use(express.static(path.resolve(__dirname, '../dist')))
app.get('*', function (req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
  res.send(html)
})
// 后端api路由
// app.use('/api', userApi);
// 监听端口
app.listen(80);
console.log('success listen at port:8080......');