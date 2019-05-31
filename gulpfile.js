const gulp = require('gulp');
const mjml = require('gulp-mjml');
const config = require('./config.json');

gulp.task('default', function () {
    return gulp.src(config.compile.source)
        .pipe(mjml())
        .pipe(gulp.dest(config.compile.destination))
})
