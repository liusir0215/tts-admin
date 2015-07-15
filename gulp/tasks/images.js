/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('images', ()=> {
	return gulp.src(config.images.imagesSrc)
		.pipe($.plumber())
		.pipe(gulp.dest(config.images.imagesDest))
		.pipe($.size())
});

gulp.task('minifyImages', ['images'], () => {
	return gulp.src(config.images.minifySrc)
		.pipe($.plumber())
		.pipe($.if($.if.isFile, $.cache($.imagemin({
			progressive: true,
			interlaced: true,
			// don't remove IDs from SVGs, they are often used
			// as hooks for embedding and styling
			svgoPlugins: [{cleanupIDs: false}]
		}))
			.on('error', function (err) {
				console.log(err);
				this.end();
			})))
		.pipe(gulp.dest(config.images.minifyDest))
		.pipe($.size());
});