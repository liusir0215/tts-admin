/**
 * Created by liusheng on 15-7-6.
 */
import gulp from 'gulp';
import runSequence from 'run-sequence';

gulp.task('build', ()=> {
	runSequence('clean', ['minifyHtml', 'minifyImages', 'styles', 'uglifyJs', 'fonts']);
});