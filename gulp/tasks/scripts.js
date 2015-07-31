/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import browserify from 'browserify';
import config from '../config';
import source from 'vinyl-source-stream';
import globby from 'globby';
import gulpLoadPlugins from 'gulp-load-plugins';
import watchify from 'watchify';
import hbsfy from 'hbsfy';
import _ from 'lodash-compat';

const $ = gulpLoadPlugins();


var browserifyTask = function (callback, devMode) {

	function handleError(err) {
		console.log(err.toString());
		this.emit('end');
	}

	globby(config.scripts.scriptsSrc, function (er, files) {
		var bundleConfigs = files.reduce(function (pre, cur) {
			pre.push({
				entries: cur,
				dest: config.scripts.scriptsBrowsDest,
				outputName: cur.split(config.scripts.baseDir)[1],
				extensions: config.scripts.extensions
			});
			return pre;
		}, []);

		var bundleQueue = bundleConfigs.length;

		var browserifyThis = function (bundleConfig) {

			if (devMode) {
				// Add watchify args and debug (sourcemaps) option
				_.extend(bundleConfig, watchify.args, {debug: true});
				// A watchify require/external bug that prevents proper recompiling,
				// so (for now) we'll ignore these options during development
				// bundleConfig = _.omit(bundleConfig, ['external', 'require'])
			}

			var b = browserify(bundleConfig);

			var bundle = function () {

				return b
					.bundle()
					// Report compile errors
					.on('error', handleError)
					// Use vinyl-source-stream to make the
					// stream gulp compatible. Specify the
					// desired output filename here.
					.pipe(source(bundleConfig.outputName))
					// Start piping stream to tasks!
					.pipe(gulp.dest(bundleConfig.dest))
					.on('end', reportFinished);
			};

			if (devMode) {
				// Wrap with watchify and rebundle on changes
				b = watchify(b);
				// Rebundle on update
				b.on('update', bundle);
			} else {
				// Sort out shared dependencies.
				// b.require exposes modules externally
				if (bundleConfig.require) {
					b.require(bundleConfig.require);
				}
				// b.external excludes modules from the bundle, and expects
				// they'll be available externally
				if (bundleConfig.external) {
					b.external(bundleConfig.external);
				}
			}

			var reportFinished = function () {

				if (bundleQueue) {
					bundleQueue--;
					if (bundleQueue === 0) {
						// If queue is empty, tell gulp the task is complete.
						// https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
						callback();
					}
				}
			};

			return bundle();
		};

		// Start bundling with Browserify for each bundleConfig specified
		bundleConfigs.forEach(browserifyThis);
		console.log('browserify end');

	});
};
gulp.task('scripts', browserifyTask);

gulp.task('uglifyJs', ['scripts'], ()=> {
	console.log('uglify start');
	return gulp.src(config.scripts.scriptsDistSrc)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.uglify())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.scripts.scriptsDistDest))
		.pipe($.size());
});
