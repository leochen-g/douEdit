var superagent = require('superagent');
var cheerio = require('cheerio');//引入cheerio

//请求
req = function(url,method, params, data, headers, cookies, files, auth, timeout, allow_redirects, proxies, hooks, stream, verify, cert, json) {
  superagent(method, url)
        .query(params)
        .send(data)
        .set(headers)
        .set('Cookie', cookies)
        .end(function (err, response) {
            if (err) {
                return err
            }
            return response
        })
}
//请求返回html
xml = function (url, method, params, data) {
    r = req(url, method, params, data)
    return cheerio.load(r.text);
}
//请求返回json
json_req = function (url, method, params, data) {
    r = req(url, method, params, data)
    return r
}
module.exports ={
  req,xml,jso_req
}