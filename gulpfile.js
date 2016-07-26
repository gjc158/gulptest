var gulp = require('gulp'),
	gutil=require('gulp-util'),
	jshint = require('gulp-jshint')//js代码检验
	uglify=require('gulp-uglify'),// js混淆
	concat=require('gulp-concat'),// js拼接
	stripDebug = require('gulp-strip-debug'),// 删除debug模式
	jsmin = require('gulp-jsmin'),// 压缩js
	rename=require('gulp-rename'),// 重命名
	less = require('gulp-less'),// less
	cssmin = require('gulp-minify-css'),// 压缩css
	sourcemaps = require('gulp-sourcemaps'),// css map
	csscomb = require('gulp-csscomb'),// css格式化
	autoprefixer = require('gulp-autoprefixer'),// css自动添加前缀
	notify = require('gulp-notify'),// 提示信息
	clean = require('gulp-clean'),// 清除内容
	htmlmin = require('gulp-htmlmin'),// html压缩
	spritesmith = require('gulp.spritesmith'),// 图片精灵
	imagemin = require('gulp-imagemin'),// 图片压缩
	cache = require('gulp-cache'), // 缓存
	pngquant = require('imagemin-pngquant'),//深度压缩
	rev = require('gulp-rev'),// 版本号
	revCollector = require('gulp-rev-collector'),
	gulpSync = require('gulp-sync')(gulp)
	;//

/* 默认 */

gulp.task('default',function () {

	gulp.start('help');

});
/**
 * 整合js
 */
gulp.task('js', function() {
    gulp.src(['src/js/*.js', '!src/js/all.js', '!src/js/all.min.js'])
    	.pipe(jshint())
    	.pipe(jshint.reporter('default'))
	    .pipe(concat('all.js'))
	    .pipe(stripDebug())
	    .pipe(gulp.dest('src/js'))
        //.pipe(uglify())
	    .pipe(jsmin())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('src/js'));
});

/**
 * test js version
 */
/*gulp.task('js-ver', function() {
    gulp.src('src/js/all.js')
     	.pipe(rev())
     	.pipe(gulp.dest('src/js'))
    	.pipe(rev.manifest())
    	.pipe(gulp.dest('src/js'));
});*/
/**
 * 
 * 编译样式
 */
gulp.task('less', function() {
    gulp.src(['src/css/style.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer([
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24', // Firefox 24 is the latest ESR 
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6']))
    .pipe(csscomb())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/css'))
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/css')); 
});
/**
 * imagemin
 */ 
gulp.task('imagemin', ['sprites'], function() {
	gulp.src('src/image/sprites.png')
		.pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
		.pipe(gulp.dest('src/image'));
});
/**
 * 图片精灵
 */
gulp.task('sprites',['imagemin-icons'], function() {
	gulp.src('src/image/icons/*.{png,jpg,gif,ico}')
		.pipe(spritesmith({
			imgName: 'sprites.png',
			cssName: 'sprites.css',
			//cssFormate: 'less',
			padding: 20,
			algorithm: 'binary-tree',
		}))
		.pipe(gulp.dest('src/image'));
});

gulp.task('imagemin-icons', function() {
	gulp.src('src/image/icons/*.{png,jpg,gif,ico}')
		.pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
		.pipe(gulp.dest('src/image/icons'));
});
/**
 * 版本号添加
 */
gulp.task('rev', function () {
	return gulp.src(['src/js/*.js', 'src/css/*.css', 'src/image/*.css', 'src/image/*.png', 'src/*.html'], {base: 'src'})
	 	.pipe(rev())
	 	.pipe(gulp.dest('release'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('release'));
});
gulp.task('rev-html', function () {
	gulp.src(['release/*.json', 'release/*.html'])
        .pipe( revCollector({
            replaceReved: true,
        }) )
        .pipe( gulp.dest('release') );
});
//gulp.task('rev', gulpSync.sync(['rev-js', 'rev-css', 'rev-image', 'rev-html']));
/**
 * 清除发布内容
 */
gulp.task('clean', function() {
	return gulp.src(['release/css/*', 'release/js/*', 'release/image/*', 'release/*.html', 'release/*.json'])
			.pipe(clean());
});
/**
 * 预发布目录
 */
/*gulp.task('release',  function() {
	gulp.src('src/css/*.css')
		.pipe(gulp.dest('release/css'));
	gulp.src('src/js/*')
		.pipe(gulp.dest('release/js'));
	gulp.src('src/image/*.{png,jpg,gif,ico}')
		.pipe(gulp.dest('release/image'));
	gulp.src('src/*.html')
		.pipe(htmlmin({
			removeComments: true,
            collapseWhitespace: true,
            preserveLineBreaks: true
		}))
		.pipe(gulp.dest('release'));
});*/
gulp.task('build', gulpSync.sync(['clean',['rev'], 'rev-html']));
/**
 * 监控样式
 */
gulp.task('watch:less', function(){
	gulp.watch(['src/css/*.less'], ['less']);
});