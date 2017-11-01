const router = require('express').Router();

const HttpError = require('../helpers/HttpError');
const Session = require('../helpers/Session');

router.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Token');
    next();
});

/**
 * Define error handler
 */
router.use(HttpError.middleware);

// /**
// * Define session handler
// */
router.use(Session.middleware);

router.options('/*', (req, res, next) => {
    res.statusCode = 200;
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE, OPTIONS');
    res.send();
});
router.get('/*', (req, res, next) => {
    res.statusCode = 200;
    next();
});
router.post('/*', (req, res, next) => {
    res.statusCode = 201;
    next();
});
router.put('/*', (req, res, next) => {
    res.statusCode = 202;
    next();
});
router.patch('/*', (req, res, next) => {
    res.statusCode = 202;
    next();
});
router.delete('/*', (req, res, next) => {
    res.statusCode = 200;
    next();
});

const auth = require('./auth');
const post = require('./post');
const blog = require('./blog');
const user = require('./user');

/* Assign routes */
router.use('/auth', auth);
router.use('/post', post);
router.use('/blog', blog);
router.use('/user', user);

/* API error hendler */
router.use((err, req, res, next) => {
    if (!err) {
        err = new HttpError(404);
    }

    if (typeof err === 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    }
    else {
        next(err);
    }
});

module.exports = router;
