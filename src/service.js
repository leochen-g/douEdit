//豆瓣删帖
let cheerio = require('cheerio');//引入cheerio
let $ = require('jquery')
let constant = require('./constant')
let base = require('./base')

/**填充占位符*/
format = function (source, params) {
	if (arguments.length == 1)
		return function () {
			let args = $.makeArray(arguments);
			args.unshift(source);
			return format.apply(this, args);
		};
	if (arguments.length > 2 && params.constructor != Array) {
		params = $.makeArray(arguments).slice(1);
	}
	if (params.constructor != Array) {
		params = [params];
	}
	params.forEach(function (i, n) {
		source = source.replace(new RegExp("\\%s"), i);
	});
	return source;
};

// 解析收藏列表的链接
_parse_collect_path = function (text) {
	let $ = text
	let url = $('.doulist-list a').attr('href')
	return url
}
// 解析收藏列表
_parse_collect_list = function (text) {
	let $ = text
}
//解析帖子列表
_parse_topic_list = function (text) {
	let $ = text
	let result = []
	$('.title a').each(function (index, element) {
		let $element = $(element);
		let href = $element.attr('href');
		let href_item = href.split('/');
		result.push(href_item[5]);
	});
	return result
}
//解析帖子列表详情
_parse_topic_all_info_list = function (text) {
	let $ = text
	let result = []
	$('.olt tr').each(function (index, element) {
		var obj = {}
		let $element = $(element);
		let href = $element.find('.title a').attr('href');
		let href_item = href.split('/');
		obj.id = href_item[5];
		obj.title = $element.find('.title a').attr('title');
		obj.replyCount = $element.find('.td-reply').text().replace('回应', '');
		obj.date = $element.find('.td-time').text()
		result.push(obj)
	});
	return result
}
//解析评论列表
_parse_comment_list = function (text) {
	let $ = text
	let result = [];
	let obj = {}
	$('#comments li').each(function (index, element) {
		let $element = $(element);
		result.push($element.attr('data-cid'));
	});
	let topic = $('.action-react a').attr('data-object_id')
	obj[topic] = result
	return obj
}

// 获取指定topic id下的评论
// 格式 {'topicId':['cid1','cid2','cid3','cid4']}
getCidByTopic = async function (Cookies, topic, start = 0) {
	let url = format(constant.API_GROUP_GET_TOPIC, [topic])
	let text = await base.xml(url, 'GET', {start: start}, '', Cookies)
	return _parse_comment_list(text)
}
//获取个人发布帖子列表带分页
//[{date: " 2018-09-18" ,id: "124407168" ,replyCount: "0",title: "11111111"}]
getSelfTopicList = async function (Cookies, userId, start = 0) {
	let param = [userId]
	let url = format(constant.API_GROUP_LIST_USER_PUBLISHED_TOPICS, param)
	let text = await base.xml(url, 'GET', {'start': start}, '', Cookies)
	let result = _parse_topic_all_info_list(text)
	return result
}

//获取所有帖子下的回复cid
//[ 'topicId1':['cid11','cid12'],'topicId2':['cid21','cid22'] ]
getAllTopicCid = async function (Cookies, ck, userId, start = 0) {
	let topicList = await getSelfTopicList(Cookies, userId, start)
	let allComment = []
	for (i of topicList) {
		let comment = await getCidByTopic(Cookies, i.id, start)
		allComment.push(comment)
	}
	console.log('all',allComment)
	return allComment
}


// 删除指定topic下所有评论，带分页
removeCommentByTopicId = async function (Cookies, ck, userId, topicId, start = 0, socket) {
	let cidObj = await getCidByTopic(Cookies, topicId, start)
	for (i in cidObj) {
		for (j in cidObj[i]) {
			await removeCommentByTidCid(Cookies, ck, i, obj[i][j], socket)
			if (socket) {
				socket.emit('chat message', '第' + item[i][j] + '个评论已删除')
			}
			console.log('第' + obj[i][j] + '个评论已删除')
		}
	}
	return 'ok'
}
//删除指定帖子的所有评论
removeCommentByTidCid = async function (Cookies, ck, topic, cid, socket) {
	let url = format(constant.API_GROUP_REMOVE_COMMENT, [topic])
	let data = {'cid': cid, 'ck': ck, 'reason': 'other_reason', "other": "other_reason", 'submit': '确定'}
	try {
		await base.req(url, 'POST', {cid: cid}, data, Cookies)
		return 'ok'
	} catch (err) {
		if (socket) {
			socket.emit('delete comment', '由于删除操作过于频繁，你的操作被豆瓣认为是机器人，建议用浏览器打开官网后，输入验证码，再重新操作删除')
		}
		return '机器人认定Error'
	}
}

//删除指定帖子
removeTopicById = async function (Cookies, ck, topic) {
	let url = format(constant.API_GROUP_REMOVE_TOPIC, [topic])
	let param = {'ck': ck}
	let result = await req(url, 'POST', param, '', Cookies)
	let res = ''
	if(result.status === 200){
		res = 'ok'
	}else {
		res = 'error'
	}
	return res
}

// 获取收藏列表
get_collect_list = async function (body, res) {
	Cookies = body.Cookies
	ck = body.ck
	userId = body.dbcl2
	param = [userId]
	let url = format(constant.API_PEOPLE_HOME, param)
	xml(url, 'GET', '', '').then(result => {
		let collectUrl = [_parse_collect_path(result)]
		xml(collectUrl, 'GET').then(collectXml => {
			let obj = _parse_collect_list(collectXml)
		})
	})
}

module.exports ={
	getSelfTopicList:getSelfTopicList,
	getCidByTopic:getCidByTopic,
	getAllTopicCid:getAllTopicCid,
	removeCommentByTopicId:removeCommentByTopicId,
	removeTopicById:removeTopicById
}
