#!/usr/bin/env node

/* esversion: 6 */

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

var routes = {
  '/save': {
    'POST': (request) => {
      console.log(request);
    }
  }
};

http.createServer((request, response) => {
  var {url, method} = request;
  if (routes[url] && routes[url][method]) {
    routes[url][method](request);
  } else {
    var localPath = '.' + url;
    fs.exists(localPath, (exists) => {
      if (exists && fs.lstatSync(localPath).isFile()) {
        response.writeHead(200);
        response.write(fs.readFileSync(localPath));
      } else {
        response.writeHead(404);
        response.write('NOPE');
      }
      response.end();
    });
  }
}).listen(8080);
