//豆瓣删帖
var superagent = require('superagent');//引入superagent 插件
var cheerio = require('cheerio');//引入cheerio
var $ = require('jquery')
require('constant')
//Cookie
var Cookie = '';
//host
var host = API_HOST
//Origin
var Origin = API_HOME;
//Referer
var Referer = API_GROUP_GROUP;
//参数ck
var ck = '';
var userId = ''

/**填充占位符*/
$.format = function (source, params) {
  if (arguments.length == 1)
	return function () {
	  var args = $.makeArray(arguments);
	  args.unshift(source);
	  return $.format.apply(this, args);
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

console.log($.format('https://www.douban.com/group/search?start=%s&cat=1019&sort=relevance&q=%s&ds=%s',['123','464','qwwqwq']));

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
var allPublishTopicUrlList=[]//个人发布帖子所有url列表
//获取个人发布帖子列表
getPublishTopicList = function (url,param) {
  url = $.format(url,param);
  superagent
	  .get(url)
	  .set('Cookie', Cookie)
	  .set('Host', host)
	  .set('Referer', Referer)
	  .end(function (err, response) {
		if (err) {
		  return err
		}
		var $ = cheerio.load(response.text);
		var urlList = [];
		$('.title a').each(function (index, element) {
		  var $element = $(element);
		  var href = $element.attr('href');
		  var href_item = href.split('/');
		  allPublishTopicUrlList.push(href_item[5]);
		});
		if($('.paginator')){
		  	var paginatorList = []
		  	$('.paginator a').each(function (index,element) {
			  var $ = $(element);
			  var href = $.attr('href');
			  var href_item = href.split('?');
			  paginatorList.push(href_item[1])
			})
		  console.log(paginatorList);
		}
	  })
};
//获取指定帖子下的回复cid
getTopicId = function (topic) {
  var url = 'https://www.douban.com/group/topic/' + topic + '/';
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
		var cid = [];
		$('#comments li').each(function (index, element) {
		  var $element = $(element);
		  cid.push($element.attr('data-cid'));
		});
		for (let i = 0; i < cid.length; i++) {
		  console.log('正在删除' + topic + '帖子的第' + i + '条评论');
		  //	第一次执行删除自己的回复
		  // removeComment(topic,cid[i]);

		  //  第二次执行删除其他人的回复
		  // removeOtherComment(topic,cid[i]);
		}
	  });
};
//删除其他人评论
removeOtherComment = function (topic, cid) {
  var url2 = 'https://www.douban.com/group/topic/' + topic + '/remove_comment?cid=' + cid;
  superagent
	  .post(url2)
	  .send({'cid': cid, 'ck': ck, 'reason': 'other_reason', 'submit': '确定'})
	  .set('Cookie', Cookie)
	  .set('Host', host)
	  .set('Origin', Origin)
	  .set('Content-Type', 'application/x-www-form-urlencoded')
	  .set('Referer', Referer + 'topic/' + topic + '/remove_comment?cid=' + cid)
	  .end(function (err, res) {
		if (err) {
		  console.log(err);
		  return err
		}
		console.log('成功删除');
	  })
};
//删除自己评论
removeComment = function (topic, cid) {
  var url1 = 'https://www.douban.com/j/group/topic/' + topic + '/remove_comment'; //移除评论接口
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
getReply = function (body,res) {
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
deleteAllTopic = function (body,res) {
  ck = body.ck;Cookie=body.Cookies;userId=body.dbcl2
  var param = [userId]
  getPublishTopicList(API_GROUP_LIST_USER_PUBLISHED_TOPICS,param)
}
module.exports ={
  login: login,
  group:{
	publish:{

	},
	replay:{

	}
  }
}
