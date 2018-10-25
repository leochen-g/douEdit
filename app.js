const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const ctr = require('./src/controller')

app.set('trust proxy','loopback')
app.all('*',function (req,res,next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","POST,GET");
  res.header("X-Powered-By",' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
})
//设置解析数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
//定位首页
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendfile(`${__dirname}/public/index.html`)
})
function isEmpty(body) {
  for (i in body){
    if(body[i]==''||body[i]==undefined||body==null)
      return true
  }
  return false
}
//注册接口
app.post('/api/login', (req, res) => {
  var user = req.body.user;
  var psd = req.body.psd;
  var source = req.body.source
  if(isEmpty(req.body)){
    res.json({head: {code: 10000, msg: '请输入登录信息'}, data: {}})
  }else {
    ctr.login(user,psd,source,res)
  }
})
//删除所有自己发的帖子
app.post('/api/group/publish/deleteAll',(req,res) => {
  if(isEmpty(req.body)){
	res.json({head: {code: 10000, msg: '请输入完整的参数'}, data: {}})
  }else {
    ctr.group.publish.deleteAll(req.body,res)
  }
})
app.listen(3000, () => console.log('Example app listening on port 3000!'))