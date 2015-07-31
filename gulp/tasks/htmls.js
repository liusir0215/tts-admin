/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('html', ()=> {

	var templateData = {},
		options = {
			ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
			batch: [config.htmls.sharedSrc],
			helpers: {
				capitals: function (str) {
					return str.toUpperCase();
				}
			}
		};

	return gulp.src(config.htmls.htmlsSrc)
		.pipe($.plumber())
		.pipe($.compileHandlebars(templateData, options))
		.pipe($.rename(function (path) {
			path.extname = '.html';
		}))
		.pipe(gulp.dest(config.htmls.htmlsTmpDest));
});

gulp.task('minifyHtml',['html'], () => {
	const assets = $.useref.assets({searchPath: 'app'});

	return gulp.src(config.htmls.htmlsSrc)
		//.pipe($.plumber())
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
		.pipe(assets.restore())
		.pipe($.useref())
		//.pipe($.if('*.hbs', $.minifyHtml({conditionals: true, loose: true})))
		.pipe(gulp.dest(config.htmls.htmlsDistDest));
});

// Copy auto generated refs(scripts, styles) to static folder
gulp.task('copyRefScripts', function () {
	return gulp.src(config.htmls.jsSrc)
		.pipe(gulp.dest(config.htmls.jsDest));
});

gulp.task('copyRefStyles', function () {
	return gulp.src(config.htmls.cssSrc)
		.pipe(gulp.dest(config.htmls.cssDest));
});

// Remove auto generaged refs
gulp.task('htmls', ()=> {
	runSequence('minifyHtml', ['copyRefScripts', 'copyRefStyles'], del.bind(null, [config.htmls.cssDir, config.htmls.jsDir]));

});