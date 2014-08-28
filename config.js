    //项目名称
    //注意： 项目名称也同时作为服务器目录名
var name = 'test',
    svn = 'http://tc-svn.tencent.com/isd/isd_vas_rep/vas_proj/trunk/test',
    //cdn服务器
    cdn  = 'http://imgcache.qq.com/ac/vasstyle/test/',
    //预览demo存放
    demo = 'http://m.isux.us/vas/test/',
    //ars路径
    ars  = '/usr/local/imgcache/htdocs/ac/vasstyle/test'


module.exports = {
  // 站点相关，项目名
  name: name,
  svn : svn,
  cdn:  cdn,
  demo: demo,
  ars: ars,
  // path related
  src: './src/',
  offline: './offline/',
  offlineCache: './.offline/',
  zipConf: [{
      target: cdn,
      include: ['**/*.*']
  }],
  zipName:'offline.zip',
  // the copy of src
  tmp: './.src/',
  dist: './dist/',
  distCss: './dist/css/**/*.css',
  distFiles: ['**/*.*'],
  //不复制的对象
  nocopy:['!**/_*/**/*.*', '!**/_*.*'],
  //复制对象
  copySrc: ['**/*.*'],
  copyDist:['!**/_*/**/*.*', '!**/_*.*', '**/*.*'],
  //监听对象
  watchSass:['_sass/**/*.scss'],
  watchJade:['./**/*.jade'],
  watchStylus:['./**/*.styl'],
  watchHtml:['html/**/*.html'],
  watchJs:['js/**/*.js'],

  imgType: '*.{jpg,jpeg,png,gif,ttf,ico}',
  clean: ['.src/', '.sass-cache/', '.ftp','.offline/'],

  //jade config
  jade:{
    pretty:  true
  },
  //sass config
  compass:{
    //config_file: './config.rb',
    css:  './dist/css/',
    sass: './src/_sass/',
    image:'./src/img/',
    generated_image: './dist/img/',
    debug:true
  },
  //样式 prefixer 配置
  prefix:{
      platform:["last 5 version"],
      option: {cascade: true }
  },

  // dev ftp
  ftpDev:{
      host: '119.147.200.113',
      port:'21000',
      user: 'vasstyle',
      pass: 'img@qqshow11',
      remotePath:name +'/'
  },
  // demo ftp
  ftpDemo:{
      host: '183.61.39.198',
      port:'21000',
      user: 'user_00',
      pass: 'isd!@#user',
      remotePath:'vas/'+ name +'/'
  }
};
