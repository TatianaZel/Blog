const HttpError = require('helpers/HttpError');

function ACL() {
    return function (req, res, next) {
        if (req.session) {
            next();
        }
        else {
            next(new HttpError(403, 'You have not enough permissions to view this part'));
        }
    };
}

module.exports = ACL;
