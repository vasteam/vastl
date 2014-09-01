#!/usr/bin/env node

//var fs = require('fs');
var fs = require('fs-extra');
var path = require('path');
var existsSync = fs.existsSync || path.existsSync;

var url = require('url');
var async = require('async');
var runSequence = require('run-sequence');
var _ = require('lodash');
var program = require('commander');

var gulp = require('gulp'),
    zip = require('gulp-zip'),
    clean = require('gulp-rimraf'),
    newer = require('gulp-newer'),
    savefile = require('gulp-savefile'),
    prefix = require('gulp-autoprefixer');

var version = require('./package').version;

var log = console.log;


program
  .version(version)
  .option('-v, --v', 'get version')
  .option('--usecompass', 'use compass')
  // .option('-o, --outdir <dir>', 'path to output generated jade file(s) to', parsePath)
  // .option('-n, --nspaces <n>', 'the number of spaces to indent generated files with', parseInt)

program.parse(process.argv);

var args = program.args;

// if (!args || args.length === 0) {
//   args = ['-'];
//   console.error("input argument(s) missing");
//   process.exit(1);
// }

var hasArg = function(arg){
  return args.indexOf(arg) >= 0;
};

if( hasArg('init') ) {

  if( !existsSync(process.cwd()+'/project.js') ){
    
    try{
      
      fs.copySync(path.resolve(__dirname,'./tpl/project.js'), 'project.js');

    } catch(err) {

      log('fail to create project.js');
      process.exit(1);
    }

    log('project.js created, remember to edit it');
  } else {

    log('there is already a project.js ');
  }

  if( program.usecompass ){
    
    if( !existsSync(process.cwd()+'/config.rb') ){
    
      try{
        
        fs.copySync(path.resolve(__dirname,'./tpl/config.rb'), 'config.rb');

      } catch(err) {

        log('fail to create config.rb');
        process.exit(1);
      }

      log('config.rb created');

    } else {

      log('there is already a config.rb');
    }
      
  } 
} else {

  // is project.js exit?
  try{
    var configs = require(process.cwd()+'/project');
  } catch(err) {
    log('no project.js found in ./; Try: vastl init  or vastl init --usecompass');
    process.exit(1);
  }

}

if( program.v ) {
  log('version: ' + version);
}


// global vars
var configs = require(process.cwd()+'/project');

var src = configs.src,
    dist = configs.dist,
    tmp = configs.tmp,
    opt = {
      cwd: src
    },
    distOpt = {
      cwd: dist
    };

function parsePath(arg) {
  if (typeof arg !== 'string') {
    console.error('invalid input: ' + arg);
  } else if (path.resolve('/',arg) === arg) {
    // already absolute path
    return arg;
  } else if (arg.length >= 2 && arg.substring(0, 2) === '~/') {
    // home path
    return path.join(process.env['HOME'], arg.substring(2));
  } else {
    // relative to current path
    return path.join(process.cwd(), arg);
  }
}




// prepare files to package to offline zip
gulp.task('offline:prepare', function(cb) {
  
  var config = configs.offline;

  var q = _.map(config.zipConf, function(item) {

      return function(callback) {
        var urlObj = url.parse(item.target);
        var target = path.join(config.cache, urlObj.hostname, urlObj.pathname);
        
        gulp.src(item.include, distOpt)
            .pipe(gulp.dest(target))
            .on('end', function() {

                callback();
            });
      };
  });

  async.parallel(q, function(err, result) {
    cb(err, result);
  });

});

// package .offline -> offline.zip
gulp.task('offline:zip', function() {
  var config = configs.offline;
  
  log(config.dist + config.zipName +' created');

  return gulp.src(config.glob, {
      cwd: config.cache
    })
    .pipe(zip(config.zipName))
    .pipe(gulp.dest(config.dist));
});

// clean .offline
gulp.task('offline:clean', function() {
  var opt = {
      read: false
  };

  return gulp.src(configs.offline.cache, opt)
    .pipe(clean({
       force: true
    }));
});


//===================================
// clean
//===================================
// remove tmp files
gulp.task('clean', function() {
  var opt = {
    read: false
  };
  return gulp.src(configs.clean.glob, opt)
    .pipe(clean({
      force: true
    }));
});

//===================================
// copy
//===================================
// remove tmp files
gulp.task('copy', function() {

  return gulp.src(configs.copy.glob, opt)
    .pipe(newer(dist))
    .pipe(gulp.dest(dist));
});


// prefixer
gulp.task('prefix', function() {
  var config = configs.prefix;

  return gulp.src(config.glob)
    .pipe(prefix(config.platform, config.option))
    .pipe(savefile());
});


if( hasArg('zip') && configs.offline ) {

  runSequence('offline:prepare', 'offline:zip', 'offline:clean');
  log('task: offline')
}

if( hasArg('clean') && configs.clean ) {
  runSequence('clean');
  log('task: clean')
}


if( hasArg('copy') && configs.copy ) {
  
  runSequence('copy');
  log('task: copy')
}

if( hasArg('prefix') && configs.prefix ) {
  runSequence('prefix');
  log('task: prefix');
}







