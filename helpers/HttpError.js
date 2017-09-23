var util = require("util");
var http = require("http");

var HttpError = function(status, message, description) {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, HttpError);

	this.status = status;
	this.message = message || http.STATUS_CODES[status] || "Error";
	this.description = description || undefined;
};

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

HttpError.middleware = function(req, res, next) {
	res.sendHttpError = (error) => {
		res.statusCode = error.status;

		res.json(error);
	};
	next();
};

module.exports = HttpError;