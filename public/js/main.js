Vue.prototype.$axios = axios;
var app = new Vue({
	el: '#db-main',
	data() {
		return {
			form: {},
			Cookies: '',//Cookies
			ck: '',//ck值
			dbcl2: '',
			listType: '',
			replyTopicId: '',
			groupTopicId: '',
			tableData: [],
			commentDeleteLog: '',
			topicDeleteLog: '',
			socket: io(),
			start: 0
		}
	},
	created() {
		axios.defaults.baseURL = 'https://douban.xkboke.com/api';
		// axios.defaults.baseURL = '/api';
	},
	methods: {
		deleteAll() {
			let _this = this
			_this.socket.emit('chat message',{Cookies:_this.Cookies,ck:_this.ck,dbcl2:_this.dbcl2,start:parseInt(_this.start)})
			_this.socket.on('chat message', function(msg){
				_this.commentDeleteLog = msg
			});
		},
		deleteAllTopic() {
			let _this = this
			_this.socket.emit('delete topic',{Cookies:_this.Cookies,ck:_this.ck,dbcl2:_this.dbcl2,start:parseInt(_this.start)})
			_this.socket.on('delete topic', function(msg){
				_this.topicDeleteLog = msg
			});
		},
		getCookies(strcookie, matchcookie) {
			var getMatchCookie;
			var arrCookie = strcookie.split(";");
			for (var i = 0; i < arrCookie.length; i++) {
				var arr = arrCookie[i].split("=");
				if (matchcookie == arr[0]) {
					getMatchCookie = arr[1];
					break;
				}
			}
			return getMatchCookie;
		},
		changeCookies() {
			var _this = this;
			if (_this.Cookies) {
				window.localStorage.setItem('dbCookies', _this.Cookies);
				_this.ck = _this.getCookies(_this.Cookies, ' ck')
				_this.dbcl2 = _this.getCookies(_this.Cookies, ' dbcl2').split(':')[0].replace('"', '')
			} else {
				if (window.localStorage.getItem('dbCookies')) {
					_this.Cookies = window.localStorage.getItem('dbCookies')
					_this.ck = _this.getCookies(_this.Cookies, ' ck')
					_this.dbcl2 = _this.getCookies(_this.Cookies, ' dbcl2').split(':')[0].replace('"', '')
				}
			}
		},
		clearCookies() {
			window.localStorage.clear('dbCookies')
			this.Cookies = ''
			this.ck = ''
			this.dbcl2 = ''
		},
		getTopicList(val) {
			var _this = this
			_this.listType = val
			if (val == 'publish') {
				action = '/group/publish/getAll'
			} else {
				action = '/group/reply/getAll'
			}
			axios.post(action, {Cookies: _this.Cookies, ck: _this.ck, dbcl2: _this.dbcl2})
					.then(function (res) {
						_this.tableData = res.data.data
						console.log(res.data.data);
					})
					.catch(function (err) {
						console.log(err);
					})
		},
		deleteCommit(id, obj) {
			var _this = this;
			action = '/group/remove/comment'
			axios.post(action, {Cookies: _this.Cookies, ck: _this.ck, dbcl2: _this.dbcl2, topicId: id})
					.then(function (res) {
						if (res.data.data === {}) {
							_this.$message({
								message: '成功删除评论',
								type: 'success'
							});
							console.log(res.data.data);
							getTopicList('publish')
						} else {
							_this.$message.error(res.data.data);
						}
					})
					.catch(function (err) {
						_this.$message.error(err);
					})
		},
		deleteTopic(id) {
			var _this = this;
			action = '/group/remove/topic'
			axios.post(action, {Cookies: _this.Cookies, ck: _this.ck, dbcl2: _this.dbcl2, topicId: id})
					.then(function (res) {
						if (res.data.data === {}) {
							_this.$message({
								message: '成功删除帖子',
								type: 'success'
							});
							console.log(res.data.data);
							getTopicList('publish')
						} else {
							_this.$message.error(res.data.data);
						}
					})
					.catch(function (err) {
						_this.$message.error(err);
					})
		}
	}
})
