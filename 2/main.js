#!/usr/bin/env node

// This application will manage and compare screenshots at different points throughout a test suite
// Exit Codes:
// 1 - Bad arguments

// possible todos
// --delete flag to clean up any files that we're analyzed/added to the database

var fs = require('fs');
var base64 = require('base64-js');
var resemble = require('resemble').resemble;
var uuid = require('node-uuid');
var Image = require('canvas').Image;
var _ = require('underscore');

var args = {};

// This piece of code extracts all of the flags being passed to the program and
// the corresponding subarguments.
(() => {
  var lastFlag;
  _(process.argv.slice(2, process.argv.length)).each(function (arg) {
    if (/^(-\w|--\w[\w-]*)$/.test(arg)) {
      lastFlag = arg;
      args[arg] = [];
    } else if (lastFlag === undefined) {
      process.exit(1);
    } else {
      args[lastFlag].push(arg);
    }
  });
})();

// This piece of code converts the args object into a more usable format
(() => {
  var {
    '--set-master': set_master,
    '--compare': compare,
    '--path': path,
    '--version': version
  } = args;
  args = {set_master, compare, path, version}
})();

// imageData stores all of the data for the screenshots. This includes the name
// and locations for the master screenshots.

var ImageData = function (path) {
  this._data_file_path = path;
  try {
    this._json = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    this._json = {};
  }
  // We specifically want to overwrite any previous failures because they should not persist to a subsequent test
  this._json.failures = [];
}

ImageData.prototype.set_master = function (tag, path) {
  var filename = uuid.v1() + '.png';
  fs.writeFileSync('images/' + filename, fs.readFileSync(path));
  this._json[tag] = {
    filename,
    versions: {}
  };
}

ImageData.prototype.record_version = function (version, tag, path) {
  var filename = uuid.v1() + '.png';
  fs.createReadStream(path).pipe(fs.createWriteStream('images/' + filename));
  this._json[tag].versions[version] = filename;
}

ImageData.prototype.record_failure = function (version, tag) {
  this._json.failures.push({
    version,
    tag
  });
}

ImageData.prototype.save = function () {
  fs.writeFileSync(this._data_file_path, JSON.stringify(this._json));
}

var imageData = new ImageData('data.json');

if (args['-h'] !== undefined || args['--help'] !== undefined) {
  console.log(
`help!!!`
  );
  process.exit();
}

if (args.set_master !== undefined) {
  var tag = args.set_master[0];
  if (args.set_master.length !== 1) {
    console.log('--set-master expects a single argument');
    process.exit(1);
  } else if (args.path === undefined) {
    console.log('you must specify the --path');
  } else {
    imageData.set_master(tag, args.path[0]);
    if (args.version) {
      imageData.record_version(args.version[0], tag, args.path[0]);
    }
    imageData.save();
  }
  process.exit();
}

if (args.compare !== undefined) {
  var tag = args.compare[0];
  resemble('images/' + imageData._json[tag].filename).compareTo(args.path[0])
    .onComplete((data) => {
      if (Number(data.misMatchPercentage) > 0) {
        imageData.record_failure(args.version[0], tag);
        console.log('failure');
      } else {
        console.log('success');
      }
      if (args.version) {
        imageData.record_version(args.version[0], tag, args.path[0]);
      }
      imageData.save();
    });
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
