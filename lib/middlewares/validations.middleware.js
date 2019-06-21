"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("nconf");
const debug = require('debug')('app:router');
const exceptionHandler = __importStar(require("../exceptions/exception.handler"));
const sentry = __importStar(require("@sentry/node"));
sentry.init({ dsn: config.get("DSN") });
class ValidationMiddleware {
    constructor() {
    }
    validationMiddlewareByRequest(validator, prameterType) {
        let result = false;
        let err;
        let message;
        let object;
        return (req, res, next) => {
            if (prameterType === 1 /* body */)
                object = req.body;
            else
                object = req.query;
            debug(`validation the following object: ${object}`);
            result = validator.validate(object);
            switch (result) {
                case true:
                    next();
                    break;
                case false:
                    err = validator.getValidationError();
                    if (err.name === "ValidationError")
                        message = err.details.map((detail) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
                    debug(message);
                    sentry.captureException(err);
                    next(new exceptionHandler.HttpException(400, message.reduce((prvs, curr) => prvs.concat('\r\n', curr))));
                    break;
            }
        };
    }
    validationMiddlewareByObject(validator, validObject) {
        let result = false;
        let err;
        let message;
        return (req, res, next) => {
            result = validator.validate(validObject);
            debug(`object Validation Result is ${result} for ${validObject} `);
            switch (result) {
                case true:
                    next();
                    break;
                case false:
                    err = validator.getValidationError();
                    if (err.name === "ValidationError")
                        message = err.details.map((detail) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
                    debug(message);
                    sentry.captureException(err);
                    next(new exceptionHandler.HttpException(400, message.reduce((prvs, curr) => prvs.concat('\r\n', curr))));
                    break;
            }
        };
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
//# sourceMappingURL=validations.middleware.js.map