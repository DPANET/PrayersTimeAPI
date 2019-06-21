"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require('debug')('app:router');
const config = require("nconf");
const prayerlib = __importStar(require("@dpanet/prayers-lib"));
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
//import { NextFunction, NextHandleFunction } from "connect";
const exception_handler_1 = require("../exceptions/exception.handler");
const sentry = __importStar(require("@sentry/node"));
const validationController = __importStar(require("../middlewares/validations.middleware"));
const validators = __importStar(require("../validators/validations"));
const retry = __importStar(require("async-retry"));
const ramda_1 = __importDefault(require("ramda"));
sentry.init({ dsn: config.get("DSN") });
class PrayersController {
    constructor() {
        this.searchLocation = async (request, response, next) => {
            try {
                let locationSettings;
                let address = request.query;
                locationSettings = await prayerlib.LocationBuilder.createLocationBuilder()
                    .setLocationAddress(address.address)
                    .createLocation();
                response.json(locationSettings);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayerLocation = (request, response, next) => {
            try {
                response.json(this._prayerManager.getPrayerLocationSettings());
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.reloadConfig = async (request, response, next) => {
            try {
                await this.initializePrayerManger();
                response.json('ok');
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.validatePrayerConfigRequest = async (request, response, next) => {
            try {
                let fn = this._validationConfigPrayerObject(request.query.prayerConfig);
                fn(request, response, next);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.validateLocationConfigRequest = async (request, response, next) => {
            try {
                let fn = this._validateConfigLocationObject(request.query.locationConfig);
                fn(request, response, next);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.validatePrayerManagerRequest = async (request, response, next) => {
            try {
                let fn = this._validatePrayerManager(this._prayerManager);
                fn(request, response, next);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.updatePrayersByCalculation = async (request, response, next) => {
            try {
                let prayerConfig = this.buildPrayerConfigObject(request.body.prayerConfig);
                let locationConfig = request.body.locationConfig;
                this._prayerManager = await this.refreshPrayerManager(prayerConfig, locationConfig);
                await this._prayerManager.savePrayerConfig(this._prayerManager.getPrayerConfig());
                await this._prayerManager.saveLocationConfig(this._prayerManager.getLocationConfig());
                // prayerConfig = await new prayerlib.Configurator().getPrayerConfig();
                // this._prayerManager = await this.refreshPrayerManager(prayerConfig,locationConfig)
                response.json("completed");
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayersByCalculation = async (request, response, next) => {
            try {
                let config = request.query;
                let prayerConfig = this.buildPrayerConfigObject(config.prayerConfig);
                let locationConfig = config.locationConfig;
                debug(locationConfig);
                //let locationConfig: prayerlib.ILocationConfig = await new prayerlib.Configurator().getLocationConfig();
                this._prayerManager = await this.refreshPrayerManager(prayerConfig, locationConfig);
                debug(this._prayerManager.getPrayerAdjsutments());
                response.json(this.createPrayerViewRow(this.createPrayerView(this._prayerManager.getPrayers())));
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.putPrayersSettings = (request, response) => {
            let prayerSettings = request.body;
        };
        this.getPrayerAdjsutments = (request, response, next) => {
            try {
                let prayerAdjustments = this._prayerManager.getPrayerAdjsutments();
                response.json(prayerAdjustments);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayersSettings = (request, response, next) => {
            try {
                let prayersSettings = this._prayerManager.getPrayerSettings().toJSON();
                response.json(prayersSettings);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayers = (request, response, next) => {
            try {
                let prayers = this._prayerManager.getPrayers();
                response.json(prayers);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayerView = (request, response, next) => {
            try {
                let prayersView = this.createPrayerView(this._prayerManager.getPrayers());
                response.json(prayersView);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        this.getPrayerViewRow = (request, response, next) => {
            try {
                let prayerViewRow = this.createPrayerViewRow(this.createPrayerView(this._prayerManager.getPrayers()));
                response.json(prayerViewRow);
            }
            catch (err) {
                debug(err);
                sentry.captureException(err);
                next(new exception_handler_1.HttpException(404, err.message));
            }
        };
        try {
            this.path = "/PrayerManager";
            this.router = express_1.default.Router();
            this._validationController = new validationController.ValidationMiddleware();
            this.initializeValidators();
            //  this.prayerViewMobileRequestValidator =
            this.initializePrayerManger()
                .then(() => {
            })
                .catch((err) => { throw err; });
            this.initializeRoutes();
        }
        catch (err) {
            throw err;
        }
    }
    initializeValidators() {
        this._validatePrayerManager = this._validationController
            .validationMiddlewareByObject.bind(this, validators.PrayerMangerValidator.createValidator());
        this._validateConfigPrayerParam = this._validationController.validationMiddlewareByRequest
            .bind(this, validators.PrayerConfigValidator.createValidator(), 0 /* query */);
        this._validateConfigPrayerBody = this._validationController.validationMiddlewareByRequest
            .bind(this, validators.PrayerConfigValidator.createValidator(), 1 /* body */);
        this._validateConfigLocationObject = this._validationController.validationMiddlewareByObject
            .bind(this, validators.LocationValidator.createValidator());
        this._validationConfigPrayerObject = this._validationController.validationMiddlewareByObject
            .bind(this, validators.PrayerConfigValidator.createValidator());
        //  this.validateConfigLocationRequest = this._validationController.validationMiddlewareByObject.bind(this,validato)
    }
    initializeRoutes() {
        this.router.get(this.path + "/PrayersAdjustments", this.validatePrayerManagerRequest, this.getPrayerAdjsutments);
        this.router.get(this.path + "/PrayersSettings", this.validatePrayerManagerRequest, this.getPrayersSettings);
        this.router.get(this.path + "/Prayers", this.validatePrayerManagerRequest, this.getPrayers);
        this.router.get(this.path + "/PrayersViewDesktop", this.validatePrayerManagerRequest, this.getPrayerView);
        this.router.get(this.path + "/PrayersViewMobile", this.validatePrayerConfigRequest, this.validateLocationConfigRequest, this.getPrayersByCalculation);
        this.router.get(this.path + "/LoadSettings", this.reloadConfig);
        this.router.post(this.path + "/PrayersViewMobile/", this.validatePrayerConfigRequest, this.validateLocationConfigRequest, this.updatePrayersByCalculation);
        this.router.get(this.path + "/PrayersLocation/", this.validatePrayerManagerRequest, this.getPrayerLocation);
        this.router.get(this.path + "/SearchLocation/", this.searchLocation);
        //  this.router.put(this.path + "/PrayersSettings/:id", this.putPrayersSettings);
    }
    getPrayerManager() {
        return this._prayerManager;
    }
    buildPrayerConfigObject(prayerConfigObject) {
        for (var key in prayerConfigObject) {
            switch (key) {
                case "_":
                    delete prayerConfigObject['_'];
                    break;
                case "startDate":
                case "endDate":
                    prayerConfigObject[key] = new Date(prayerConfigObject[key]);
                    break;
                case "adjustments":
                    let adjustmentArray = prayerConfigObject[key];
                    for (var adjustkey in adjustmentArray) {
                        adjustmentArray[adjustkey].adjustments = parseInt(adjustmentArray[adjustkey].adjustments);
                    }
                    break;
                case "method":
                case "school":
                case "latitudeAdjustment":
                case "midnight":
                case "adjustmentMethod":
                    prayerConfigObject[key] = parseInt(prayerConfigObject[key]);
                    break;
            }
        }
        return prayerConfigObject;
    }
    createPrayerViewRow(prayersView) {
        let prayerViewRow = new Array();
        prayersView.forEach((prayerViewObject, index, arr) => {
            prayerViewRow.push({ prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.FAJR, prayerTime: prayerViewObject.Fajr }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.SUNRISE, prayerTime: prayerViewObject.Sunrise }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.DHUHR, prayerTime: prayerViewObject.Dhuhr }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.ASR, prayerTime: prayerViewObject.Asr }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.SUNSET, prayerTime: prayerViewObject.Sunset }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.MAGHRIB, prayerTime: prayerViewObject.Maghrib }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.ISHA, prayerTime: prayerViewObject.Isha }, { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.MIDNIGHT, prayerTime: prayerViewObject.Midnight });
        });
        return prayerViewRow;
    }
    createPrayerView(prayers) {
        let sortObject = (obj) => {
            return {
                prayersDate: moment_1.default(obj.prayersDate).toDate().toDateString(),
                Imsak: moment_1.default(obj.Imsak).format('LT'),
                Fajr: moment_1.default(obj.Fajr).format('LT'),
                Sunrise: moment_1.default(obj.Sunrise).format('LT'),
                Dhuhr: moment_1.default(obj.Dhuhr).format('LT'),
                Asr: moment_1.default(obj.Asr).format('LT'),
                Sunset: moment_1.default(obj.Sunset).format('LT'),
                Maghrib: moment_1.default(obj.Maghrib).format('LT'),
                Isha: moment_1.default(obj.Isha).format('LT'),
                Midnight: moment_1.default(obj.Midnight).format('LT'),
            };
        };
        let swapPrayers = (x) => ramda_1.default.assoc(x.prayerName, x.prayerTime, x);
        let removePrayers = (x) => ramda_1.default.omit(['prayerName', 'prayerTime', 'undefined'], x);
        let prayerTime = ramda_1.default.pipe(swapPrayers, removePrayers);
        let prayerTimes = (x) => ramda_1.default.map(prayerTime, x);
        let prayersList = (x) => ramda_1.default.append({ prayersDate: x.prayersDate }, x.prayerTime);
        let projectPrayers = ramda_1.default.curry(sortObject);
        let pump = ramda_1.default.pipe(prayersList, prayerTimes, ramda_1.default.mergeAll, projectPrayers);
        return ramda_1.default.map(pump, prayers);
    }
    async refreshPrayerManager(prayerConfig, locationConfig) {
        let count = 0;
        try {
            return await retry.default(async (bail) => {
                count += 1;
                debug(`the number is now reached ${count}`);
                let _prayerManager = await prayerlib.PrayerTimeBuilder
                    .createPrayerTimeBuilder(locationConfig, prayerConfig)
                    .createPrayerTimeManager();
                return _prayerManager;
            }, {
                retries: 1,
                minTimeout: 1000
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async initializePrayerManger() {
        try {
            let locationConfig = await new prayerlib.Configurator().getLocationConfig();
            let prayerConfig = await new prayerlib.Configurator().getPrayerConfig();
            this._prayerManager = await this.refreshPrayerManager(prayerConfig, locationConfig);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            throw err;
        }
    }
    static getPrayerController() {
        return;
    }
}
exports.default = PrayersController;
//# sourceMappingURL=prayers.controller.js.map