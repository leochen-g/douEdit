//豆瓣删帖
let cheerio = require('cheerio');//引入cheerio
let $ = require('jquery')
let constant = require('./constant')
require('./base')
//Cookie
let Cookies = ''
//host
let host = constant.API_HOST
//Origin
let Origin = constant.API_HOME;
//Referer
let Referer = constant.API_GROUP_GROUP;
//参数ck
let ck = '';
let userId = ''

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

//登录(弃用)
login = function (user, psd, source, response) {
  let url = 'https://www.douban.com/accounts/login'
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
//获取指定topic id下的评论
get_comments_by_topic = function (topic, start = 0) {
  let url = format(constant.API_GROUP_GET_TOPIC, [topic])
  return xml(url, 'GET', {start: start}, '', Cookies)
	  .then(result=>{
		return  _parse_comment_list(result)
	  })
}

// validate = async function () {
//  let res = await get_comments_by_topic(126620784,0)
//  	console.log('结果',res);
// }
//删除指定帖子的所有评论
remove_comment_by_topic_and_cid = function (topic, cid) {
  let url = format(constant.API_GROUP_REMOVE_COMMENT, [topic])
  let data = {'cid': cid, 'ck': ck, 'reason': 'other_reason', 'submit': '确定'}
  req(url, 'POST', '', data, Cookies)
	  .then(result => {
	    console.log('一次执行结果',result);
	    return result
	  }, error => {
	    console.log('错误',error.response.body.r);
		if (error.response.body.r) {
		  req(format(constant.API_GROUP_ADMIN_REMOVE_COMMENT, [topic]), 'POST', '', data, Cookies)
			  .then(result=>{
			    console.log('二次执行后结果',result);
			    return result
			  })
		} else {
		  throw  error
		}
	  })
};
//删除指定帖子
remove_topic_by_topic = function (topic) {
  let url = format(constant.API_GROUP_REMOVE_TOPIC, [topic])
  let param = {'ck': ck}
  return req(url, 'POST', param, '', Cookies)
	  .then(result=>{
	    return result
	  })
}
//获取所有帖子下的回复cid
get_all_publish_topic_cid = async function (body, start = 0) {
  let topicList =await  get_all_publish_topic(body, start)
  let allComment = []
  for(i in topicList){
    let comment = await get_comments_by_topic(topicList[i],0)
	allComment.push(comment)
  }
  return allComment
};

//获取个人发布帖子列表
get_all_publish_topic_list = function (body,res, start = 0) {
  Cookies = body.Cookies
  ck = body.ck
  userId = body.dbcl2
  param = [userId]
  url = format(constant.API_GROUP_LIST_USER_PUBLISHED_TOPICS, param);
  return xml(url, 'GET', {'start': start}, '', Cookies)
	  .then(result=>{
		return res.json({head: {code: 0, msg: 'ok'}, data:_parse_topic_list(result)})
	  })
};
// 获取所有回复的帖子
get_all_reply_topic_list = function (body,res, start=0,) {
  Cookies = body.Cookies
  ck = body.ck
  userId = body.dbcl2
  param = [userId]
  let url = format(constant.API_GROUP_LIST_USER_COMMENTED_TOPICS,param)
  return xml(url,'GET',{'start':start},'',Cookies)
	  .then(result=>{
	    return _parse_topic_list(result)
	  })
}
// let obj = {
//   Cookies: 'll="108296"; bid=xPi2CReRblM; _vwo_uuid_v2=D0A240BFA82732349367B2EF6EB2B7F92|6dd2f91b45e6c13d7dc4542a9af62183; _ga=GA1.2.1255902232.1525503530; douban-fav-remind=1; douban-profile-remind=1; ps=y; push_doumail_num=0; push_noty_num=0; ue="478914121@qq.com"; __utmv=30149280.14388; ct=y; __utmc=30149280; viewed="26301434"; gr_user_id=479a0200-1428-4339-8292-a59c18685e94; dbcl2="143887437:IA6j+ryFzRg"; ck=Ul7S; __utmz=30149280.1540435736.27.24.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ap_v=0,6.0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1540528421%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DR6a-2rw5im0vKuceCGfBelCJaFYVp_05iAl9tGbbTncP6IwTC-WU4-q-3844SXFW%26ck%3D1688.2.6.139.154.130.142.470%26shh%3Dwww.baidu.com%26sht%3D98012088_5_dg%26wd%3D%26eqid%3Dfc7806df0000cecb000000045bd12f0e%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1255902232.1525503530.1540519842.1540528421.31; __utmt=1; _pk_id.100001.8cb4=44b34387331b5713.1526034366.27.1540528585.1540522941.; __utmb=30149280.9.9.1540528585449',
//   ck: 'Ul7S',
//   dbcl2: '143887437'
// }
// get_all_reply_topic_list(obj,'',0)

//小组操作
deleteAllTopic = function (body, res) {
  ck = body.ck;
  Cookie = body.Cookies;
  userId = body.dbcl2
  let param = [userId]
  getPublishTopicList(API_GROUP_LIST_USER_PUBLISHED_TOPICS, param)
}
module.exports = {
  login: login,
  group: {
	publish: get_all_publish_topic_list,
	replay: {}
  }
}
