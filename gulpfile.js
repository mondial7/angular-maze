'use strict';
 
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// Sass compilation task
function compileSass() {
	return gulp.src('./assets/scss/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(gulp.dest('./assets/css/'));
}

// Watch task
function watchSass() {
	return gulp.watch('./assets/scss/*.scss', compileSass);
}

// Export tasks
exports.sass = compileSass;
exports.watch = gulp.series(compileSass, watchSass);
exports.happy = gulp.series(compileSass, watchSass);
exports.default = exports.happy;