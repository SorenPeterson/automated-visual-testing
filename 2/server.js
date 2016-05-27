/* jshint esversion: 6 */

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"};

http.createServer((request, response) => {
  var {url} = request;
  var localPath = '.' + url;
  fs.exists((exists) => {
    var stats = fs.lstatSync(localPath);
    if (stats.isFile()) {
      response.writeHead(200);
      response.write(fs.readFileSync(localPath));
    } else {
      response.writeHead(404);
      response.write('NOPE');
    }
  });
  response.end();
}).listen(8080);
