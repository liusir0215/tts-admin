/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import config from '../config';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

gulp.task('less', () => {
	return gulp.src(config.styles.lessSrc)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.less())
		.pipe($.autoprefixer({browsers: ['last 2 version']}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.styles.lessDest))
		.pipe($.size());
});

gulp.task('styles', ['less'], ()=> {
	return gulp.src(config.styles.minifySrc)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.minifyCss())
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(config.styles.minifyDest))
	  .pipe($.size())
});