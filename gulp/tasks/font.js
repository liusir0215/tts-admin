/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import config from '../config';

gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')({
		filter: '**/*.{eot,svg,ttf,woff,woff2}'
	}).concat(config.fonts.fontSrc))
		.pipe(gulp.dest(config.fonts.fontTmpDest))
		.pipe(gulp.dest(config.fonts.fontDistDest));
});