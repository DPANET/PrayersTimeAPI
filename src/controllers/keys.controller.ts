const debug = require('debug')('app:router');
import { IController } from "./controllers.interface";
import express from 'express';
import path from 'path';
import config from "nconf";
import request from "request";
import { HttpException } from "../exceptions/exception.handler";
import { NextFunction } from "connect";
import * as sentry from "@sentry/node";
sentry.init({ dsn: config.get("DSN") });

export default class KeyController implements IController {
    path: string;
    router: express.Router;
    private _googleKey: string;
    constructor() {
        this.path = "";
        this.router = express.Router();
        //  this._filePath = config.get("MAIN_FILE_PATH");
        //  this._fileName = config.get("MAIN_FILE_NAME");
        this._googleKey = config.get("GOOGLE_PLACE_KEY");
        this.initializeRoutes();

    }
    private initializeRoutes() {
        this.router.get(this.path + "/Places", this.mainPageRoute);
    }
    private mainPageRoute = (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            let url: string = `https://maps.googleapis.com/maps/api/js?key=${this._googleKey}&libraries=places`;
            request.get(url).pipe(res);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);

            next(new HttpException(404, err.message));
        }
    }
}

