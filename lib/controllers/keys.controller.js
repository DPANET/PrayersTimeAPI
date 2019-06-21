"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('app:router');
const express_1 = __importDefault(require("express"));
const nconf_1 = __importDefault(require("nconf"));
const request_1 = __importDefault(require("request"));
const exception_handler_1 = require("../exceptions/exception.handler");
const sentry = __importStar(require("@sentry/node"));
sentry.init({ dsn: nconf_1.default.get("DSN") });
class KeyController {
    constructor() {
        this.mainPageRoute = (req, res, next) => {
            try {
                let url = `https://maps.googleapis.com/maps/api/js?key=${this._googleKey}&libraries=places`;
                request_1.default.get(url).pipe(res);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.path = "";
        this.router = express_1.default.Router();
        //  this._filePath = config.get("MAIN_FILE_PATH");
        //  this._fileName = config.get("MAIN_FILE_NAME");
        this._googleKey = nconf_1.default.get("GOOGLE_PLACE_KEY");
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path + "/Places", this.mainPageRoute);
    }
}
exports.default = KeyController;
//# sourceMappingURL=keys.controller.js.map