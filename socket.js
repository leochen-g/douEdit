var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// socket监听3001端口
server.listen(3001,function(){
// 让socket监听3001端口
	console.log('Server listening on port:',3001);
});

// 用来监听/发送消息
// emit:发送消息  on:监听socket请求
io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});
