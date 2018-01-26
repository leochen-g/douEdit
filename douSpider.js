//豆瓣删帖
var superagent = require('superagent');//引入superagent 插件
var cheerio = require('cheerio');//引入cheerio

//Cookie
var Cookie='bid=_Cm2pZ4SB7E; __yadk_uid=nvK26FhcTBIblu8cVOh0KTK1sTsiVpZX; gr_user_id=3ddda4c6-54c0-4d6c-a57e-d92545190b70; _vwo_uuid_v2=025C36ED43C4E342914A76D68F877E30|bf36bc1c1a38e673d875167be0e7f577; viewed="1484767_5914587_4606471_1052241"; ll="108288"; __utmc=30149280; _ga=GA1.2.279848459.1505439684; ps=y; dbcl2="143887437:H0TvpQReykk"; ck=1tcE; push_doumail_num=0; __utmv=30149280.14388; ap=1; push_noty_num=0; ct=y; __utmz=30149280.1516865631.43.36.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __ads_session=QRUzsiqOCgnl9ewJaAA=; _pk_ref.100001.8cb4=%5B%22%22%2C%22%22%2C1516873159%2C%22https%3A%2F%2Fwww.baidu.com%2Flink%3Furl%3DWuiimtSvRsaeOov3mlULBvWx5R67KzmNNRsdZVeg93a%26wd%3D%26eqid%3D9d3f753100019469000000045a697a0a%22%5D; _pk_ses.100001.8cb4=*; __utma=30149280.279848459.1505439684.1516871344.1516873159.45; __utmt=1; _pk_id.100001.8cb4=c6f69886c595c778.1505439679.42.1516874049.1516871344.; __utmb=30149280.48.5.1516874049230';
//host
var host ='www.douban.com';
//Origin
var Origin ='https://www.douban.com';
//Referer
var Referer = 'https://www.douban.com/group/';
//参数ck
var ck ='1tcE';

//获取个人帖子列表
getTopic =function () {
    var url = 'https://www.douban.com/group/people/143887437/publish';
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
					// spider(urlList[i]);
				// 第三执行删帖操作
				removeTopic(urlList[i]);
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
					console.log('正在删除第'+topic+'帖子的第'+i+'条评论');
				//	第一次执行删除自己的回复
				//removeComment(topic,cid[i]);

                //  第二次执行删除其他人的回复
				//removeOtherComment(topic,cid[i]);
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

