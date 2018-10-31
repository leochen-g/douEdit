//豆瓣删帖
var cheerio = require('cheerio');//引入cheerio
var $ = require('jquery')
var constant = require('./constant')
require('./base')
//Cookie
var Cookies = 'll="108296"; bid=xPi2CReRblM; _vwo_uuid_v2=D0A240BFA82732349367B2EF6EB2B7F92|6dd2f91b45e6c13d7dc4542a9af62183; _ga=GA1.2.1255902232.1525503530; douban-fav-remind=1; douban-profile-remind=1; ps=y; push_doumail_num=0; push_noty_num=0; ue="478914121@qq.com"; __utmv=30149280.14388; ct=y; __utmc=30149280; viewed="26301434"; gr_user_id=479a0200-1428-4339-8292-a59c18685e94; dbcl2="143887437:IA6j+ryFzRg"; ck=Ul7S; __utmz=30149280.1540435736.27.24.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ap_v=0,6.0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1540528421%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DR6a-2rw5im0vKuceCGfBelCJaFYVp_05iAl9tGbbTncP6IwTC-WU4-q-3844SXFW%26ck%3D1688.2.6.139.154.130.142.470%26shh%3Dwww.baidu.com%26sht%3D98012088_5_dg%26wd%3D%26eqid%3Dfc7806df0000cecb000000045bd12f0e%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1255902232.1525503530.1540519842.1540528421.31; __utmt=1; _pk_id.100001.8cb4=44b34387331b5713.1526034366.27.1540528585.1540522941.; __utmb=30149280.9.9.1540528585449';
//host
var host = constant.API_HOST
//Origin
var Origin = constant.API_HOME;
//Referer
var Referer = constant.API_GROUP_GROUP;
//参数ck
var ck = 'Ul7S';
var userId = '143887437'

/**填充占位符*/
format = function (source, params) {
  if (arguments.length == 1)
	return function () {
	  var args = $.makeArray(arguments);
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

//登录(弃用)
login = function (user, psd, source, response) {
  var url = 'https://www.douban.com/accounts/login'
  superagent.post(url, {form_email: user, source: source, form_password: psd})
	  .set('Content-Type', 'application/x-www-form-urlencoded')
	  .set('Host', host)
	  .set('Referer', 'https://www.douban.com')
	  .set('Origin', Origin)
	  .redirects(0)
	  .then(res => console.log(res))
	  .catch(err => console.log(err.response.text)); // 目标内容
}
//解析帖子列表
_parse_topic_list = function (text) {
  var $ = text
  var result = []
  $('.title a').each(function (index, element) {
	var $element = $(element);
	var href = $element.attr('href');
	var href_item = href.split('/');
	result.push(href_item[5]);
  });
  return result
}
//解析评论列表
_parse_comment_list = function (text) {
  var $ = text
  var result = [];
  var obj = {}
  $('#comments li').each(function (index, element) {
	var $element = $(element);
	result.push($element.attr('data-cid'));
  });
  var topic = $('.action-react a').attr('data-object_id')
  obj[topic] = result
  return obj
}
//获取个人发布帖子列表
get_all_publish_topic = async function (body, start = 0) {
  Cookies = body.Cookies
  ck = body.ck
  userId = body.dbcl2
  param = [userId]
  url = format(constant.API_GROUP_LIST_USER_PUBLISHED_TOPICS, param);
  return xml(url, 'GET', {'start': start}, '', Cookies)
};
//获取指定topic id下的评论
get_comments_by_topic = function (topic, start = 0) {
  var url = format(constant.API_GROUP_GET_TOPIC, [topic])
  return xml(url, 'GET', {start: start}, '', Cookies)
}
//获取所有帖子下的回复cid
get_all_publish_topic_cid = function (body, start = 0) {
  get_all_publish_topic(body, 0)
	  .then(result => {
		return _parse_topic_list(result)
	  })
	  .then(result => {
		asyncArray = []
		for (i in result) {
		  asyncArray.push(get_comments_by_topic(result[i], 0))
		}
		return Promise.all(asyncArray)
	  })
	  .then(result => {
	    var arr = []
		result.forEach(function (current) {
		  arr.push(_parse_comment_list(current))
		})
		console.log(arr);
		return arr
	  })
};
var obj = {
  Cookies: 'll="108296"; bid=xPi2CReRblM; _vwo_uuid_v2=D0A240BFA82732349367B2EF6EB2B7F92|6dd2f91b45e6c13d7dc4542a9af62183; _ga=GA1.2.1255902232.1525503530; douban-fav-remind=1; douban-profile-remind=1; ps=y; push_doumail_num=0; push_noty_num=0; ue="478914121@qq.com"; __utmv=30149280.14388; ct=y; __utmc=30149280; viewed="26301434"; gr_user_id=479a0200-1428-4339-8292-a59c18685e94; dbcl2="143887437:IA6j+ryFzRg"; ck=Ul7S; __utmz=30149280.1540435736.27.24.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ap_v=0,6.0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1540528421%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DR6a-2rw5im0vKuceCGfBelCJaFYVp_05iAl9tGbbTncP6IwTC-WU4-q-3844SXFW%26ck%3D1688.2.6.139.154.130.142.470%26shh%3Dwww.baidu.com%26sht%3D98012088_5_dg%26wd%3D%26eqid%3Dfc7806df0000cecb000000045bd12f0e%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1255902232.1525503530.1540519842.1540528421.31; __utmt=1; _pk_id.100001.8cb4=44b34387331b5713.1526034366.27.1540528585.1540522941.; __utmb=30149280.9.9.1540528585449',
  ck: 'Ul7S',
  dbcl2: '143887437'
}
get_all_publish_topic_cid(obj, 0)
//删除评论
remove_comment = function (topic, cid) {
  var url = format(constant.API_GROUP_REMOVE_COMMENT, [topic])
  var param = {cid: cid}
  var data = {'cid': cid, 'ck': ck, 'reason': 'other_reason', 'submit': '确定'}
  var res = req(url, 'POST', param, data, Cookies)
  if (res.text[r]) {
	res = req(format(constant.API_GROUP_ADMIN_REMOVE_COMMENT, [topic]), 'POST', param, data, Cookies)
  }
  console.log('结果', res);
  return res
};

//删除帖子
removeTopic = function (topic) {
  var url3 = 'https://www.douban.com/group/topic/' + topic + '/remove?ck=' + ck;
  superagent
	  .get(url3)
	  .set('Cookie', Cookie)
	  .set('Host', host)
	  .set('Referer', Referer + 'topic/' + topic + '/')
	  .end(function (err, res) {
		if (err) {
		  console.log(err);
		  return err
		}
		console.log('成功删帖');
	  })
};
// 获取所有回复的帖子
getReply = function (body, res) {
  var url = 'https://www.douban.com/group/people/143887437/reply';
  superagent.get(url)
	  .set('Cookie', Cookie)
	  .set('Host', host)
	  .set('Referer', Referer)
	  .end(function (err, res) {
		if (err) {
		  return err
		}
		var $ = cheerio.load(res.text);
		var replyUrlList = [];
		$('.title a').each(function (index, element) {
		  var $element = $(element);
		  var href = $element.attr('href');
		  var href_item = href.split('/');
		  replyUrlList.push(href_item[5]);
		});
		console.log(replyUrlList);
		for (var i = 0; i < replyUrlList.length; i++) {
		  console.log('正在处理第' + i + '帖子');
		  // spider(urlList[i]);
		  // 第三执行删帖操作
		  getReplyCid(replyUrlList[i], 200);
		}
	  })
}

//删除自己的评论
removeReply = function (topic, cid) {
  var url1 = 'https://www.douban.com/j/group/topic/' + topic + '/remove_comment';
  console.log(url1);
  superagent
	  .post(url1)
	  .send({'cid': cid, 'ck': ck})
	  .set('Cookie', Cookie)
	  .set('Host', host)
	  .set('Origin', Origin)
	  .set('Content-Type', 'application/x-www-form-urlencoded')
	  .set('Referer', Referer + 'topic/' + topic + '/')
	  .end(function (err, res) {
		if (err) {
		  console.log(err);
		  return err
		}
		console.log('成功删除');
	  })
}
//找到对应topic的cid
getReplyCid = function (topic, start) {
  var url = 'https://www.douban.com/group/topic/' + topic + '/?start=' + start;
  superagent
	  .get(url)
	  //请求结束后的操作
	  .end(function (err, res) {
		if (err) {
		  console.log(err);
		  return err;
		}
		//解析请求后得到的body数据
		var $ = cheerio.load(res.text);
		var cid = $('#' + userId + ' .operation-more a').attr('data-cid')
		console.log('cid', cid);
		removeReply(topic, cid);
	  });
}

//小组操作
deleteAllTopic = function (body, res) {
  ck = body.ck;
  Cookie = body.Cookies;
  userId = body.dbcl2
  var param = [userId]
  getPublishTopicList(API_GROUP_LIST_USER_PUBLISHED_TOPICS, param)
}
module.exports = {
  login: login,
  group: {
	publish: {},
	replay: {}
  }
}
