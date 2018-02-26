'use strict';

const gulp = require('gulp'),
      concat = require('gulp-concat'),
      gulpif = require('gulp-if'),
      arg = require('yargs').argv,
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify'),
      cssmin = require('gulp-cssmin'),
      notify = require('gulp-notify'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      prefixer = require('gulp-autoprefixer'),
      eslint = require('gulp-eslint'),
      del = require('del'),
      ts = require('gulp-typescript');

var src = {
    vendors: {
        bootstrap: {
            lib: './public/bower_components/bootstrap/dist/css/bootstrap.min.css',
            theme: './public/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
            ui: './public/bower_components/angular-bootstrap/ui-bootstrap.min.js',
            uiTltps: './public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
        },
        angular: {
            lib: './public/bower_components/angular/angular.min.js',
            router: './public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
            stateEvents: './public/bower_components/angular-ui-router/release/stateEvents.min.js',
            localstorage: './public/bower_components/angular-local-storage/dist/angular-local-storage.min.js',
            animate: './public/bower_components/angular-animate/angular-animate.min.js'
        },
        jquery: {
            lib: './public/bower_components/jquery/dist/jquery.min.js'
        },
        socket: {
            lib: './public/bower_components/socket.io.client/dist/socket.io-1.3.5.js'
        }
    },
    frontApp: {
        allJS: './public/src/**/*.js',
        mainModule: './public/src/app.module.js',
        services: './public/src/**/*.service.js',
        filters: './public/src/**/*.filter.js',
        components: './public/src/**/*.component.js',
        directives: './public/src/**/*.directive.js',
        routes: './public/src/**/*.routes.js',
        views: './public/src/**/*.html',
        tests: './public/src/**/*.spec.js'
    },
    styles: './public/src/**/*.scss',
    allJS: './**/*.js'
};

gulp.task('jsVendors', () => {
    gulp.src([
            src.vendors.jquery.lib,
            src.vendors.angular.lib,
            src.vendors.bootstrap.ui,
            src.vendors.bootstrap.uiTltps,
            src.vendors.angular.localstorage,
            src.vendors.angular.router,
            src.vendors.angular.stateEvents,
            src.vendors.angular.animate
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/build'));
});

gulp.task('styleVendors', () => {
    gulp.src([
            src.vendors.bootstrap.lib,
            src.vendors.bootstrap.theme
        ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./public/build'));
});

gulp.task('views', () => {
    gulp.src(src.frontApp.views)
        .pipe(gulp.dest('./public/build/views'));
});

gulp.task('js', () => {
    gulp.src([
            src.frontApp.mainModule,
            src.frontApp.services,
            src.frontApp.filters,
            src.frontApp.components,
            src.frontApp.directives,
            src.frontApp.routes
        ])
        .pipe(concat('app.js'))
        .pipe(ts({
            target: "es5",
            allowJs: true,
            module: "commonjs",
            moduleResolution: "node"
        }))
        .pipe(uglify())
        .on('error', notify.onError({
            title: 'js minify error!',
            message: '<%=error.message%>'
        }))
        .pipe(gulpif(arg.development, sourcemaps.write()))
        .pipe(gulp.dest('./public/build'));
});

gulp.task('styles', () => {
    gulp.src(src.styles)
        .pipe(sass())
        .on('error', notify.onError({
            title: 'Sass error!',
            message: '<%=error.message%>'
        }))
        .pipe(prefixer())
        .pipe(gulpif(!arg.development, cssmin()))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./public/build'));
});

gulp.task('watch', () => {
    watch([src.frontApp.allJS, '!' + src.frontApp.tests], () => {
        gulp.start('js');
    });

    watch(src.frontApp.views, () => {
        gulp.start('views');
    });

    watch(src.styles, () => {
        gulp.start('styles');
    });

//    watch([src.allJS, '!' + src.frontApp.allJS, '!node_modules/**'], () => {
//        gulp.start('backLint');
//    });
});

gulp.task('backLint', () => {
    return gulp.src([src.allJS, '!' + src.frontApp.allJS, '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format('./.eslintrc.json'))
        .pipe(eslint.failOnError())
        .on('error', notify.onError({
            title: 'Eslint error!',
            message: '<%=error.message%>'
        }));
});

gulp.task('clean', () => {
    return del(['./public/build']);
});

gulp.task('default', ['jsVendors', 'styleVendors', 'views', 'js', 'styles', 'watch']);
