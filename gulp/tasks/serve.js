/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import config from '../config'

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('serve', ['clean', 'less', 'scripts', 'fonts', 'html', 'images'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.tmp/htmls'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch([
		config.htmls.htmlsSrc,
		config.scripts.scriptsSrc,
		config.images.imagesSrc,
		config.fonts.fontChange
	]).on('change', reload);

	gulp.watch(config.styles.lessSrc, ['styles']);
	gulp.watch(config.fonts.fontSrc, ['fonts']);
	gulp.watch(config.bower, ['wiredep', 'fonts']);
});

/*
 gulp.task('serve:dist', () => {
 browserSync({
 notify: false,
 port: 9000,
 server: {
 baseDir: [config.dist]
 }
 });
 });

 gulp.task('serve:test', () => {
 browserSync({
 notify: false,
 port: 9000,
 ui: false,
 server: {
 baseDir: config.test,
 routes: {
 '/bower_components': 'bower_components'
 }
 }
 });

 gulp.watch('test/spec/!**!/!*.js').on('change', reload);
 gulp.watch('test/spec/!**!/!*.js', ['lint:test']);
 });*/
