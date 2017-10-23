'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    arg = require('yargs').argv,
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer');

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
            localstorage: './public/bower_components/angular-local-storage/dist/angular-local-storage.min.js'
        },
        jquery: {
            lib: './public/bower_components/jquery/dist/jquery.min.js'
        },
        socket: {
            lib: './public/bower_components/socket.io.client/dist/socket.io-1.3.5.js'
        }
    },
    app: {
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
    styles: './public/src/**/*.scss'
};

gulp.task('jsVendors', function () {
    gulp.src([src.vendors.jquery.lib, src.vendors.angular.lib, src.vendors.bootstrap.ui,
              src.vendors.bootstrap.uiTltps, src.vendors.angular.localstorage, src.vendors.angular.router,
              src.vendors.angular.stateEvents])
            .pipe(concat('vendor.js'))
            .pipe(gulp.dest('./public/build'));
});

gulp.task('styleVendors', function () {
    gulp.src([src.vendors.bootstrap.lib, src.vendors.bootstrap.theme])
            .pipe(concat('vendor.css'))
            .pipe(gulp.dest('./public/build'));
});

gulp.task('views', function () {
    gulp.src(src.app.views)
            .pipe(gulp.dest('./public/build/views'));
});

gulp.task('js', function () {
    gulp.src([src.app.mainModule, src.app.services, src.app.filters, src.app.components, src.app.directives, src.app.routes])
            .pipe(concat('app.js'))
//            .pipe(uglify())
//            .pipe(gulpif(arg.development, sourcemaps.write()))
            .pipe(gulp.dest('./public/build'));
});

gulp.task('styles', function () {
    gulp.src(src.styles)
            .pipe(sass())
            .on('error', notify.onError({
                title: 'Sass error!',
                message: '<%=error.message%>'
            }))
            .pipe(prefixer())
            .pipe(gulpif(!arg.development, cssmin()))
            .pipe(concat('main.css'))
            .pipe(gulp.dest('./public/build'))
            .pipe(notify('Yeah! Styles done!'));
});

gulp.task('watch', function () {
    watch([src.app.allJS, '!' + src.app.tests], function () {
        gulp.start('js');
    });

    watch(src.app.views, function () {
        gulp.start('views');
    });

    watch(src.styles, function () {
        gulp.start('styles');
    });
});

gulp.task('default', ['jsVendors', 'styleVendors', 'views', 'js', 'styles', 'watch']);
