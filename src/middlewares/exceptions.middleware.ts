import { NextFunction, Request, Response } from 'express';
import * as exceptionHandler from '../exceptions/exception.handler';


export class ExceptionMiddleware
{
    constructor()
    {

    }

    errorMiddleware(error: exceptionHandler.HttpException, request: Request, response: Response, next: NextFunction) {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        response
          .status(status)
          .send({
            status,
            message,
          })
      }
}