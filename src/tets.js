var superagent = require('superagent');//引入superagent 插件
constant = require('./constant')
//Cookie
var Cookies = 'll="108296"; bid=xPi2CReRblM; _vwo_uuid_v2=D0A240BFA82732349367B2EF6EB2B7F92|6dd2f91b45e6c13d7dc4542a9af62183; _ga=GA1.2.1255902232.1525503530; douban-fav-remind=1; douban-profile-remind=1; ps=y; push_doumail_num=0; push_noty_num=0; ue="478914121@qq.com"; __utmv=30149280.14388; ct=y; __utmc=30149280; viewed="26301434"; gr_user_id=479a0200-1428-4339-8292-a59c18685e94; dbcl2="143887437:IA6j+ryFzRg"; ck=Ul7S; __utmz=30149280.1540435736.27.24.utmcsr=baidu|utmccn=(organic)|utmcmd=organic; ap_v=0,6.0; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1540528421%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DR6a-2rw5im0vKuceCGfBelCJaFYVp_05iAl9tGbbTncP6IwTC-WU4-q-3844SXFW%26ck%3D1688.2.6.139.154.130.142.470%26shh%3Dwww.baidu.com%26sht%3D98012088_5_dg%26wd%3D%26eqid%3Dfc7806df0000cecb000000045bd12f0e%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.1255902232.1525503530.1540519842.1540528421.31; __utmt=1; _pk_id.100001.8cb4=44b34387331b5713.1526034366.27.1540528585.1540522941.; __utmb=30149280.9.9.1540528585449';
//host
var host = constant.API_HOST
//Origin
var Origin = 'https://douban.com/';
//Referer
var Referer = 'https://www.douban.com/group/';
//参数ck
var ck = 'Ul7S';
var userId = '143887437'
//删除自己评论
removeComment = function (topic, cid) {
  var url1 = 'https://www.douban.com/j/group/topic/' + topic + '/remove_comment'; //移除评论接口
  console.log(host);
  superagent
	  .post(url1)
	  .send({'cid': cid, 'ck': ck})
	  .set('Cookie', Cookies)
	  .set('Host', host)
	  .set('Origin', Origin)
	  .set('Content-Type', 'application/x-www-form-urlencoded')
	  .set('Referer', Referer + 'topic/' + topic + '/')
	  .end(function (err, res) {
		if (err) {
		  console.log(err);
		  return err
		}
		console.log("结果", res.text);
	  })
}
removeComment(126620784,1728183009)