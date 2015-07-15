/**
 * Created by liusheng on 7/15/15.
 */
import gulp from 'gulp';
import spritesmith from 'gulp.spritesmith';
import gulpLoadPlugins from 'gulp-load-plugins';
import merge from 'merge-stream';
import globby from 'globby';
import config from '../config';

const $ = gulpLoadPlugins();

gulp.task('sprites', ()=> {
	globby(config.sprites.imgSrc, function (err, files) {
		files.forEach(function (item) {
			const dir = item.split(config.sprites.imgCurrentSrc)[1].split('/')[1];
			//console.log(config.sprites.imgCurrentSrc + '/' + dir + '/*.png');
			// Generate our spritesheet
			const spriteData = gulp.src(config.sprites.imgCurrentSrc + '/' + dir + '/*.png').pipe(spritesmith({
				imgName: dir + '.png',
				cssName: dir + '.less',
				padding: 4
			}));

			// Pipe image stream through image optimizer and onto disk
			const imgStream = spriteData.img
				.pipe(gulp.dest(config.sprites.imgDest));

			// Pipe CSS stream through CSS optimizer and onto disk
			const cssStream = spriteData.css
				.pipe(gulp.dest(config.sprites.cssDest));

			// Return a merged stream to handle both `end` events
			return merge(imgStream, cssStream);
		});

	})
});