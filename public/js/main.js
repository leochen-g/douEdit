Vue.prototype.$axios = axios;
var app = new Vue({
  el: '#db-main',
  data() {
    return {
      form:{},
	  Cookies:'',//Cookies
	  ck:'',//ck值
	  dbcl2:'',
	  replyTopicId:'',
	  groupTopicId:'',
	  topicDeleteLog:'正在删除其他人评论'
	}
  },
  methods:{
    getCookies (strcookie,matchcookie){
	  var getMatchCookie;
	  var arrCookie=strcookie.split(";");
	  for(var i=0;i<arrCookie.length;i++){
		var arr=arrCookie[i].split("=");
		if(matchcookie == arr[0]){
		  getMatchCookie = arr[1];
		  break;
		}
	  }
	  return getMatchCookie;
	},
    changeCookies () {
		var _this = this;
		if(_this.Cookies){
		  _this.ck = _this.getCookies(_this.Cookies,' ck')
		  _this.dbcl2 = _this.getCookies(_this.Cookies,' dbcl2').split(':')[0].replace('"','')
		}
	},

  }
})