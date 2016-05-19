#!/usr/bin/env node

// This application will manage and compare screenshots at different points throughout a test suite

var fs = require('fs');
var base64 = require('base64-js');
var resemble = require('resemble').resemble;
var uuid = require('node-uuid');
var Image = require('canvas').Image;
var _ = require('underscore');

var args = process.argv.slice(2, process.argv.length);

var sortedArgs = {};

(function () {
  var lastFlag;
  _(args).each(function (arg) {
    if (/^(-\w|--\w[\w-]*)$/.test(arg)) {
      lastFlag = arg;
      sortedArgs[arg] = [];
    } else if (lastFlag === undefined) {
      console.log('Malformed arguments. Try -h');
      process.exit(1);
    } else {
      sortedArgs[lastFlag].push(arg);
    }
  });
})();

if (sortedArgs['-h'] !== undefined || sortedArgs['--help'] !== undefined) {
  console.log('help!!!');
}

/*var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;

function save (data) {
  return new Promise(function (resolve, reject) {
    filename = 'images/' + uuid.v1() + '.png';
    fs.writeFile(filename, data, 'base64', function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(filename);
      }
    })
  });
}

function createImage (url) {
  var image = new Image();
  image.src = url;
  return image;
}

function getScreenshot (browser) {
  var driver = new webdriver.Builder()
      .forBrowser(browser)
      .build();

  driver.get('http://www.google.com/ncr');
  return new Promise(function (resolve, reject) {
    driver.takeScreenshot().then(function (data) {
      save(data).then(function (filename) {
        resolve(filename);
      });
    });
    driver.quit();
  })
}

Promise.all([getScreenshot('chrome'), getScreenshot('firefox')]).then(function (results) {
  console.log(results);
  debugger;
  resemble(results[0]).compareTo(results[1]).onComplete(function (data) {
    fs.writeFile('result.png', data.getBuffer(), 'base64', function () {
    });
    console.log(data);
  })
})
*/
