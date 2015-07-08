/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import browserify from 'browserify';
import config from '../config';
import source from 'vinyl-source-stream';
import globby from 'globby';
import gulpLoadPlugins from 'gulp-load-plugins';
import _ from 'lodash-compat';

const $ = gulpLoadPlugins();

gulp.task('scripts', ()=> {

	globby(config.scripts.scriptsSrc, function (er, files) {
		const bundleConfigs = files.reduce(function (pre, cur) {
			pre.push({
				entries: cur,
				dest: config.scripts.scriptsBrowsDest,
				outputName: cur.split(config.scripts.baseDir)[1],
				extensions: config.scripts.extensions
			});
			return pre;
		}, []);

		const browserifyThis = function (bundleConfig) {

			_.extend(bundleConfig, watchify.args, {debug: true});

			const b = browserify(bundleConfig);
			return b
				.bundle()
				//Pass desired output filename to vinyl-source-stream
				.pipe(source(bundleConfig.outputName))
				// Start piping stream to tasks!
				.pipe(gulp.dest(bundleConfig.dest));
		};
		bundleConfigs.forEach(browserifyThis);
	});
});


gulp.task('uglifyJs', ['scripts'], ()=> {
	return gulp.src(config.scripts.scriptsDistSrc)
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.scripts.scriptsDistDest))
		.pipe($.size());
});
