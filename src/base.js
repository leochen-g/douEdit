var superagent = require('superagent');
var cheerio = require('cheerio');//引入cheerio
var config = require('./config');
var constant = require('./constant')

//请求
req = function(url,method, params, data, cookies, callback) {
  return new Promise(function (resolve,reject) {
	superagent(method, url)
		.query(params)
		.send(data)
		.set('Host', constant.API_HOST)
		.set('Referer', constant.API_GROUP_GROUP)
		.set('Cookie', cookies)
		.end(function (err, response) {
		  if (err) {
			return err
		  }
		  resolve(response)
		})
  })

}
//请求返回html
xml = async function (url, method, params, data,cookies) {
   let r =  await req(url, method, params, data, cookies)
   return cheerio.load(r.text)
}
//请求返回json
json_req = function (url, method, params, data, cookies) {
    r = req(url, method, params, data, cookies)
    return r
}
module.exports ={
  req,xml,json_req
}