#!/usr/bin/env node

//var fs = require('fs');
var fs = require('fs-extra');
var path = require('path');
var existsSync = fs.existsSync || path.existsSync;

var url = require('url');
var async = require('async');
var runSequence = require('run-sequence');
var gulp = require('gulp');

var zip = require('gulp-zip');
var clean = require('gulp-rimraf');
var _ = require('lodash');

var program = require('commander');
var version = require('./package').version;

var log = console.log;


// configs
try{
  var configs = require(process.cwd()+'/config');
} catch(err) {
  log('no config.js found in ./');
  
  try{
    //log(path.resolve(__dirname,'./tpl/config.js'));
    
    fs.copySync(path.resolve(__dirname,'./tpl/config.js'), 'config.js');

  }catch(err){
    log('fail to create config.js');
  }
  
  log(' config.js created');
  process.exit(1);
}


// global vars
var src = configs.src,
    dist = configs.dist,
    tmp = configs.tmp,
    opt = {
      cwd: src
    },
    distOpt = {
      cwd: dist
    };

//record changes for dist
var changes = {
      list: [],
      add: function( url ){
        var list = this.list,
            i = list.length,
            repeat = false;

        while( i-- ){
          if( list[i] == url ) {
            repeat = true
          }
        }

        if( !repeat ) list.push(url);
      }
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


program
  .version(version)
  .option('-i, --init', 'init a project folder')
  .option('-z, --zip', 'zip a offline.zip')
  // .option('-t, --tabs', 'use tabs instead of spaces')
  // .option('-o, --outdir <dir>', 'path to output generated jade file(s) to', parsePath)
  // .option('-n, --nspaces <n>', 'the number of spaces to indent generated files with', parseInt)
  // .option('--donotencode', 'do not html encode characters (useful for templates)')
  // .option('--bodyless', 'do not output enveloping html and body tags')
  // .option('--numeric', 'use numeric character entities')

program.parse(process.argv);

// if outdir is provided, check existance (sorry no mkdir support yet)
// if (program.outdir && !existsSync(program.outdir)) {
//   console.error("output directory '" + program.outdir + "' doesn't exist");
//   process.exit(1);
// }

// process each arguments

var args = program.args;
if (!args || args.length === 0) {
  args = ['-'];
  // console.error("input argument(s) missing");
  //process.exit(1);
}



// prepare files to package to offline zip for alloykit
gulp.task('offline:prepare', function(cb) {

  var q = _.map(configs.zipConf, function(item) {

      return function(callback) {
        var urlObj = url.parse(item.target);
        var target = path.join(configs.offlineCache, urlObj.hostname, urlObj.pathname);
        
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

// package .offline -> offline.zip for alloykit
gulp.task('offline:zip', function() {

  log(configs.offline+configs.zipName+' created');

  return gulp.src('**/*.*', {
      cwd: configs.offlineCache
  })
    .pipe(zip(configs.zipName))
    .pipe(gulp.dest(configs.offline));


});


gulp.task('offline', function(cb) {

  return cb();
});

//===================================
// clean
//===================================
// remove tmp files
gulp.task('clean', function() {
  var opt = {
      read: false
  };
  return gulp.src(configs.clean, opt)
      .pipe(clean({
          force: true
      }));
});


if( program.zip ) {
  runSequence('offline:prepare', 'offline:zip', 'clean');
  //gulp.start('offline');
}

