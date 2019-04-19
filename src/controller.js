//豆瓣删帖
let constant = require('./constant')
const service = require('./service')
require('./base')


//获取个人发布帖子列表
get_all_publish_topic_list = async function (body, res) {
	Cookies = body.Cookies
	userId = body.dbcl2
	start = body.start
	let result = await service.getSelfTopicList(Cookies,userId,start)
	res.json({head: {code: 0, msg: 'ok'}, data: result})
}

//删除指定topic评论
remove_comment = async function (body, res) {
	Cookies = body.Cookies
	ck = body.ck
	userId = body.dbcl2
	topicId = body.topicId
	start = body.start
	let result = await service.removeCommentByTopicId(Cookies,ck,userId,topicId,start)
	res.json({head: {code: 0, msg: 'ok'}, data: result})
}

// 删除指定帖子
remove_topic = async function (body, res) {
	Cookies = body.Cookies
	ck = body.ck
	topicId = body.topicId
	let result = await removeTopicById(Cookies,ck,topicId)
	res.json({head: {code: 0, msg: 'ok'}, data: result})
}


// 获取所有回复的帖子
get_all_reply_topic_list = function (body, res, start = 0) {
	Cookies = body.Cookies
	ck = body.ck
	userId = body.dbcl2
	param = [userId]
	let url = format(constant.API_GROUP_LIST_USER_COMMENTED_TOPICS, param)
	return xml(url, 'GET', {'start': start}, '', Cookies)
			.then(result => {
				return res.json({head: {code: 0, msg: 'ok'}, data: _parse_topic_all_info_list(result)})
			})
}


// 删除所有帖子的评论
delete_all_topic_comment = async function (socket) {
	socket.on('chat message', async function (body) {
		socket.emit('chat message', '正在获取帖子所有评论，请稍等...')
		console.log('body',body)
		Cookies = body.Cookies
		ck = body.ck
		userId = body.dbcl2
		start = body.start
		try {
			let allComment = await service.getAllTopicCid(Cookies,ck,userId,start)
			for (item of allComment) {
				for (i in item){
					await removeCommentByTopicId(Cookies, ck, userId,item,start,socket)
					socket.emit('chat message', '已删除'+item+'话题所有评论')
				}
			}
			socket.emit('chat message', '已删除完毕，请修改开始条数后再次执行')
		} catch (err) {
			console.log('出现了错误', err)
			socket.emit('chat message', '由于删除操作过于频繁，你的操作被豆瓣认为是机器人，建议用浏览器打开官网后，输入验证码，再重新操作删除')
		}
	});
}
delete_all_topic = async function (socket) {
	socket.on('delete topic', async function (body){
		let start = body.start
		let topicList = await get_all_publish_topic_list(body,res,start)
		console.log('帖子列表',topicList)
	})
}
module.exports = {

	group: {
		publish: get_all_publish_topic_list,
		reply: get_all_reply_topic_list,
		removeComment: remove_comment,
		removeTopic: remove_topic,
		deleteAll: delete_all_topic_comment,
		deleteAllTopic: delete_all_topic
	},
	user: {
		collectList: get_collect_list,
	}
}
