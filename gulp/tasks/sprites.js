/**
 * Created by liusheng on 7/15/15.
 */
import gulp from 'gulp';
import spritesmith from 'gulp.spritesmith';
import gulpLoadPlugins from 'gulp-load-plugins';
import merge from 'merge-stream';
import globby from 'globby';
import config from '../config';
import sprity from 'sprity';

const $ = gulpLoadPlugins();

// generate sprite.png and _sprite.scss
gulp.task('sprites', function () {
	return sprity.src({
		src: config.sprites.imgSrc,
		cssPath: '../images/generated',
		style: './sprite.less',
		split: true,
		// ... other optional options
		// for example if you want to generate scss instead of css
		processor: 'less', // make sure you have installed sprity-sass
	})
		.pipe($.if('*.png', gulp.dest(config.sprites.imgDest), gulp.dest(config.sprites.cssDest)))
});
