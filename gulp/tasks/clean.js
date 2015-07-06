/**
 * Created by liusheng on 15-7-2.
 */
import gulp from 'gulp';
import del from 'del';
import config from '../config'

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));