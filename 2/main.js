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
    '--version': version,
    '--review': review
  } = args;
  args = {set_master, compare, path, version, review}
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

if (args.set_master) {
  var tag = args.set_master[0];
  if (!args.path) {
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

if (args.compare) {
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

if (args.review) {
}
