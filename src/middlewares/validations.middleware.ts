import config= require('nconf');
const debug = require('debug')('app:router');

import * as express from 'express';
import * as exceptionHandler from '../exceptions/exception.handler';

import * as validators from '../validators/validations';
import * as sentry from "@sentry/node";
sentry.init({ dsn: config.get("DSN") });
export const enum ParameterType {
    query = 0,
    body
}
export class ValidationMiddleware {
    constructor() {
    }

    public validationMiddlewareByRequest<T>( validator: validators.IValid<T>,prameterType: ParameterType): express.RequestHandler {
        let result: boolean = false;
        let err: validators.IValidationError;
        let message: string[];
        let object: any;
        return (req, res, next) => {
            if (prameterType === ParameterType.body)
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
                        message = err.details.map((detail: any) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
                    debug(message);
                    sentry.captureException(err);
                    next(new exceptionHandler.HttpException(400, message.reduce((prvs, curr) => prvs.concat('\r\n', curr))));
                    break;
            }
        }
    }
    public validationMiddlewareByObject<T>(validator: validators.IValid<T>,validObject: T): express.RequestHandler {
        let result: boolean = false;
        let err: validators.IValidationError;
        let message: string[];
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
                        message = err.details.map((detail: any) => `${detail.value.label} with value ${detail.value.value}: ${detail.message}`);
                    debug(message);
                    sentry.captureException(err);
                    next(new exceptionHandler.HttpException(400, message.reduce((prvs, curr) => prvs.concat('\r\n', curr))));
                    break;
            }
        }
    }
}