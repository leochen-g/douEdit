const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const ctr = require('./src/controller')
const http=require('http').Server(app);
const io = require('socket.io')(http);

app.set('trust proxy', 'loopback')
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "POST,GET");
	res.header("X-Powered-By", ' 3.2.1')
	// res.header("Content-Type", "application/json;charset=utf-8");
	next();
})
//设置解析数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
//定位首页
app.get('/', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.sendfile(`${ __dirname }/public/index.html`)
})

function isEmpty(body) {
	for (i in body) {
		if (body[i] == '' || body[i] == undefined || body == null)
			return true
	}
	return false
}

function filter(req, res, callback) {
	if (isEmpty(req.body)) {
		res.json({head: {code: 10000, msg: '请输入Cookies信息'}, data: {}})
	} else {
		callback(req.body, res)
	}
}

//登录接口
app.post('/api/login', (req, res) => {
	var user = req.body.user;
	var psd = req.body.psd;
	var source = req.body.source
	filter(req, res, ctr.login)
	if (isEmpty(req.body)) {
		res.json({head: {code: 10000, msg: '请输入登录信息'}, data: {}})
	} else {
		ctr.login(user, psd, source, res)
	}
})
//删除所有自己发的帖子
app.post('/api/group/publish/deleteAll', (req, res) => {
	filter(req, res, ctr.group.deleteAll)
})
//获取自己的发帖列表
app.post('/api/group/publish/getAll', (req, res) => {
	filter(req, res, ctr.group.publish)
})
//获取自己的回帖列表
app.post('/api/group/reply/getAll', (req, res) => {
	filter(req, res, ctr.group.reply)
})
//删除所有评论
app.post('/api/group/remove/comment', (req, res) => {
	filter(req, res, ctr.group.removeComment)
})
//删除帖子
app.post('/api/group/remove/topic', (req, res) => {
	filter(req, res, ctr.group.removeTopic)
})
//获取收藏的列表
app.post('/api/user/collectList', (req, res) => {
	filter(req, res, ctr.user.collectList)
})

io.on('connection', function(socket){
	socket.on('chat message',function (body) {
		ctr.group.deleteAll(socket)
	})
	socket.on('delete topic',function (body){
		ctr.group.deleteAllTopic(socket)
	})
});

http.listen(3001, () => console.log('Example app listening on port 3001!'))

