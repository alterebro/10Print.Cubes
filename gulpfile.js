var gulp = require('gulp'),
	del = require('del'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	postcss = require('gulp-postcss'),
	htmlmin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	gulpsequence = require('gulp-sequence')
	fs = require('fs'),
	replace = require('gulp-replace'),
	useref = require('gulp-useref'),
	gulpif = require('gulp-if');


gulp.task('clean-before', function () {
	return del([
		'dist/**/*',
		'dist'
	]);
});

gulp.task('build', function () {
	var plugins = [
		autoprefixer({browsers: ['last 1 version'], cascade: false}),
		cssnano()
	];

	return gulp.src('./src/index.html')
		.pipe(useref())
		.pipe(gulpif('*.css',postcss(plugins)))
		.pipe(gulpif('*.js', uglify().on('error', function(e){
            console.log(e);
         })))
		.pipe(gulp.dest('./dist'));
});

gulp.task('compress-inject', function() {
	return 	gulp.src('dist/index.html')
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(replace(
			/<link rel="stylesheet" href="(.*?)">/g,
			function(s, filename) {
				var css = fs.readFileSync('dist/'+filename, 'utf8');
				return '<style>' + css + '</style>';
			})
		)
		.pipe(replace(
			/<script src="(.*?)"><\/script>/g,
			function(s, filename) {
				var js = fs.readFileSync('dist/'+filename, 'utf8');
				return '<script>' + js + '</script>';
			})
		)
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-after', function () {
	return del([
		'dist/css',
		'dist/js'
	]);
});

gulp.task('default', gulpsequence('clean-before', 'build', 'compress-inject', 'clean-after') );
