import * as express from 'express';
import * as validators from '../validators/validations';
export declare const enum ParameterType {
    query = 0,
    body = 1
}
export declare class ValidationMiddleware {
    constructor();
    validationMiddlewareByRequest<T>(validator: validators.IValid<T>, prameterType: ParameterType): express.RequestHandler;
    validationMiddlewareByObject<T>(validator: validators.IValid<T>, validObject: T): express.RequestHandler;
}
