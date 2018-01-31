//豆瓣删帖
var superagent = require('superagent');//引入superagent 插件
var cheerio = require('cheerio');//引入cheerio

//Cookie
var Cookie='你的Cookie';
//host
var host ='www.douban.com';
//Origin
var Origin ='https://www.douban.com';
//Referer
var Referer = 'https://www.douban.com/group/';
//参数ck
var ck ='你的ck值';

//获取个人帖子列表
getTopic =function () {
	//这里需要注意的是需要点击到小组，你发布的列表
    var url = 'https://www.douban.com/group/people/（你的url）/publish';
    superagent
        .get(url)
        .set('Cookie',Cookie)
        .set('Host',host)
        .set('Referer',Referer)
        .end(function (err,res) {
            if(err){
                return err
            }
            var $=cheerio.load(res.text);
			var urlList=[];
			$('.title a').each(function (index,element) {
				var $element = $(element);
				var href =$element.attr('href');
				var href_item = href.split('/');
				urlList.push(href_item[5]);
			});
			for(var i =0;i<urlList.length;i++){
					console.log('正在处理第'+i+'帖子');
					spider(urlList[i]);
				// 第三执行删帖操作
				//removeTopic(urlList[i]);
            }
		})
};
//获取指定帖子的cid
spider = function (topic) {
    var url = 'https://www.douban.com/group/topic/'+topic+'/';
    superagent
        .get(url)
        //请求结束后的操作
        .end(function (err, res) {
            if (err) {
                console.log(err);
                return err;
            }
            //解析请求后得到的body数据
            var $=cheerio.load(res.text);
            var cid=[];
            $('#comments li').each(function (index,element) {
                var $element = $(element);
                cid.push($element.attr('data-cid'));
			});
            for(let i=0;i<cid.length;i++){
					console.log('正在删除'+topic+'帖子的第'+i+'条评论');
				//	第一次执行删除自己的回复
				removeComment(topic,cid[i]);

                //  第二次执行删除其他人的回复
				// removeOtherComment(topic,cid[i]);
            }
        });
};
//删除帖子
removeTopic =function (topic) {
    var url3='https://www.douban.com/group/topic/'+topic+'/remove?ck='+ck;
	superagent
		.get(url3)
		.set('Cookie',Cookie)
		.set('Host',host)
		.set('Referer',Referer+'topic/'+topic+'/')
		.end(function (err,res) {
			if(err){
				console.log(err);
				return err
			}
			console.log('成功删帖');
		})
};
//删除其他人评论
removeOtherComment=function (topic,cid) {
    var url2 ='https://www.douban.com/group/topic/'+topic+'/remove_comment?cid='+cid;
	superagent
		.post(url2)
		.send({'cid':cid,'ck':ck,'reason':'other_reason','submit':'确定'})
		.set('Cookie',Cookie)
		.set('Host',host)
		.set('Origin',Origin)
		.set('Content-Type','application/x-www-form-urlencoded')
		.set('Referer',Referer+'topic/'+topic+'/remove_comment?cid='+cid)
		.end(function (err,res) {
			if(err){
				console.log(err);
				return err
			}
			console.log('成功删除');
		})
};
//删除自己评论
removeComment =function (topic,cid) {
    var url1 = 'https://www.douban.com/j/group/topic/'+topic+'/remove_comment'; //移除评论接口
    superagent
        .post(url1)
		.send({'cid':cid,'ck':ck})
        .set('Cookie',Cookie)
        .set('Host',host)
        .set('Origin',Origin)
        .set('Content-Type','application/x-www-form-urlencoded')
        .set('Referer',Referer+'topic/'+topic+'/')
		.end(function (err,res) {
			if(err){
			    console.log(err);
				return err
			}
			console.log('成功删除');
		})

};
getTopic();

