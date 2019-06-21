const debug = require('debug')('app:router');
import config = require('nconf');
import * as prayerlib from "@dpanet/prayers-lib";
import { IController } from "./controllers.interface";
import { IPrayersView, IPrayersViewRow } from "./views.interface";
import express from 'express';
import moment from "moment";
//import { NextFunction, NextHandleFunction } from "connect";
import { HttpException } from "../exceptions/exception.handler";
import * as sentry from "@sentry/node";
import * as validationController from "../middlewares/validations.middleware"
import * as validators from "../validators/validations";
import * as retry from "async-retry";
import R from "ramda";
sentry.init({ dsn: config.get("DSN") });
export default class PrayersController implements IController {
    path: string;
    router: express.Router;
    private _prayersController: PrayersController;
    private _prayerManager: prayerlib.IPrayerManager;
    private _validationController: validationController.ValidationMiddleware;
    private _validatePrayerManager: Function;
    private _validateConfigPrayerParam: Function;
    private _validateConfigPrayerBody: Function;
    private _validateConfigLocationObject:Function;
    private _validationConfigPrayerObject:Function;
    constructor() {
        try {

            this.path = "/PrayerManager";
            this.router = express.Router();
            this._validationController = new validationController.ValidationMiddleware();

            this.initializeValidators();
            //  this.prayerViewMobileRequestValidator =
            this.initializePrayerManger()
                .then(() => {

                })
                .catch((err) => { throw err });
            this.initializeRoutes();
        }
        catch (err) {
            throw err;
        }
    }
    private initializeValidators() {
        this._validatePrayerManager = this._validationController
            .validationMiddlewareByObject.bind(this, validators.PrayerMangerValidator.createValidator());
        this._validateConfigPrayerParam = this._validationController.validationMiddlewareByRequest
            .bind(this, validators.PrayerConfigValidator.createValidator(), validationController.ParameterType.query);
        this._validateConfigPrayerBody = this._validationController.validationMiddlewareByRequest
            .bind(this, validators.PrayerConfigValidator.createValidator(), validationController.ParameterType.body);
        this._validateConfigLocationObject = this._validationController.validationMiddlewareByObject
        .bind(this,validators.LocationValidator.createValidator());
        this._validationConfigPrayerObject = this._validationController.validationMiddlewareByObject
        .bind(this,validators.PrayerConfigValidator.createValidator());
      //  this.validateConfigLocationRequest = this._validationController.validationMiddlewareByObject.bind(this,validato)
    }
    private initializeRoutes() {
        this.router.get(this.path + "/PrayersAdjustments", this.validatePrayerManagerRequest, this.getPrayerAdjsutments);
        this.router.get(this.path + "/PrayersSettings", this.validatePrayerManagerRequest, this.getPrayersSettings);
        this.router.get(this.path + "/Prayers", this.validatePrayerManagerRequest, this.getPrayers);
        this.router.get(this.path + "/PrayersViewDesktop", this.validatePrayerManagerRequest, this.getPrayerView);
        this.router.get(this.path + "/PrayersViewMobile", this.validatePrayerConfigRequest,this.validateLocationConfigRequest, this.getPrayersByCalculation);
        this.router.get(this.path + "/LoadSettings", this.reloadConfig)
        this.router.post(this.path + "/PrayersViewMobile/",  this.validatePrayerConfigRequest,this.validateLocationConfigRequest, this.updatePrayersByCalculation);
        this.router.get(this.path + "/PrayersLocation/", this.validatePrayerManagerRequest, this.getPrayerLocation);
        this.router.get(this.path +"/SearchLocation/",this.searchLocation)
        //  this.router.put(this.path + "/PrayersSettings/:id", this.putPrayersSettings);
    }
    private searchLocation  = async (request:express.Request,response:express.Response,next:express.NextFunction)=>
    {
        try{
            let locationSettings:prayerlib.ILocationSettings;
            let address = request.query;
            locationSettings = await prayerlib.LocationBuilder.createLocationBuilder()
            .setLocationAddress(address.address)
            .createLocation();
            response.json(locationSettings);
        }
        catch(err)
        {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private getPrayerLocation = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {

            response.json(this._prayerManager.getPrayerLocationSettings());
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));

        }
    }
    private reloadConfig = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            await this.initializePrayerManger();
            response.json('ok');
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));

        }
    }
    private validatePrayerConfigRequest = async (request:express.Request,response:express.Response,next:express.NextFunction)=>
    {
        try {
            let fn: express.RequestHandler = this._validationConfigPrayerObject(request.query.prayerConfig);
            fn(request, response, next);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private validateLocationConfigRequest= async (request:express.Request,response:express.Response,next:express.NextFunction)=>
    {
        try {
            let fn: express.RequestHandler = this._validateConfigLocationObject(request.query.locationConfig);
            fn(request, response, next);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private validatePrayerManagerRequest = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let fn: express.RequestHandler = this._validatePrayerManager(this._prayerManager);
            fn(request, response, next);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private getPrayerManager() {
        return this._prayerManager;
    }

    private updatePrayersByCalculation = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayerConfig: prayerlib.IPrayersConfig = this.buildPrayerConfigObject(request.body.prayerConfig);
            let locationConfig:prayerlib.ILocationConfig = request.body.locationConfig;
            this._prayerManager =await this.refreshPrayerManager(prayerConfig,locationConfig) ;
            await this._prayerManager.savePrayerConfig(this._prayerManager.getPrayerConfig());
            await this._prayerManager.saveLocationConfig(this._prayerManager.getLocationConfig())
            // prayerConfig = await new prayerlib.Configurator().getPrayerConfig();
            // this._prayerManager = await this.refreshPrayerManager(prayerConfig,locationConfig)
            response.json("completed");
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private getPrayersByCalculation = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let config:any = request.query;
            let prayerConfig: prayerlib.IPrayersConfig = this.buildPrayerConfigObject(config.prayerConfig);
            let locationConfig:prayerlib.ILocationConfig=config.locationConfig;
            debug(locationConfig);
            //let locationConfig: prayerlib.ILocationConfig = await new prayerlib.Configurator().getLocationConfig();
            this._prayerManager = await this.refreshPrayerManager(prayerConfig,locationConfig);
            debug(this._prayerManager.getPrayerAdjsutments());
            response.json(this.createPrayerViewRow(this.createPrayerView(this._prayerManager.getPrayers())));
        } catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private buildPrayerConfigObject(prayerConfigObject: any): prayerlib.IPrayersConfig {
        for (var key in prayerConfigObject) {
            switch (key) {
                case "_": delete prayerConfigObject['_'];
                    break;
                case "startDate":
                case "endDate":
                    prayerConfigObject[key] = new Date(prayerConfigObject[key]);
                    break;
                case "adjustments":
                    let adjustmentArray: Array<any> = prayerConfigObject[key];
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
    private putPrayersSettings = (request: express.Request, response: express.Response) => {
        let prayerSettings: prayerlib.IPrayersSettings = request.body;
    }
    private getPrayerAdjsutments = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayerAdjustments: prayerlib.IPrayerAdjustments[] = this._prayerManager.getPrayerAdjsutments();
            response.json(prayerAdjustments);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }

    private getPrayersSettings = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayersSettings: prayerlib.IPrayersSettings = (this._prayerManager.getPrayerSettings() as prayerlib.PrayersSettings).toJSON();
            response.json(prayersSettings);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }
    }
    private getPrayers = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayers: prayerlib.IPrayers[] = (this._prayerManager.getPrayers() as prayerlib.Prayers[]);
            response.json(prayers);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);

            next(new HttpException(404, err.message));
        }
    }
    private getPrayerView = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayersView: IPrayersView[] = this.createPrayerView(this._prayerManager.getPrayers());
            response.json(prayersView);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            next(new HttpException(404, err.message));
        }

    }
    private getPrayerViewRow = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            let prayerViewRow: Array<IPrayersViewRow> = this.createPrayerViewRow(this.createPrayerView(this._prayerManager.getPrayers()));
            response.json(prayerViewRow);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);

            next(new HttpException(404, err.message));
        }
    }
    private createPrayerViewRow(prayersView: IPrayersView[]) {
        let prayerViewRow: Array<IPrayersViewRow> = new Array<IPrayersViewRow>();
        prayersView.forEach((prayerViewObject, index, arr) => {
            prayerViewRow.push(
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.FAJR, prayerTime: prayerViewObject.Fajr },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.SUNRISE, prayerTime: prayerViewObject.Sunrise },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.DHUHR, prayerTime: prayerViewObject.Dhuhr },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.ASR, prayerTime: prayerViewObject.Asr },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.SUNSET, prayerTime: prayerViewObject.Sunset },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.MAGHRIB, prayerTime: prayerViewObject.Maghrib },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.ISHA, prayerTime: prayerViewObject.Isha },
                { prayersDate: prayerViewObject.prayersDate, prayerName: prayerlib.PrayersName.MIDNIGHT, prayerTime: prayerViewObject.Midnight });
        });
        return prayerViewRow;
    }

    private createPrayerView(prayers: prayerlib.IPrayers[]) {
        let sortObject=(obj:IPrayersView):IPrayersView =>{
            return  {
                prayersDate: moment(obj.prayersDate).toDate().toDateString() ,
                Imsak: moment(obj.Imsak).format('LT'),
                Fajr: moment(obj.Fajr).format('LT'),
                Sunrise: moment(obj.Sunrise).format('LT'),
                Dhuhr: moment(obj.Dhuhr).format('LT'),
                Asr: moment(obj.Asr).format('LT'),
                Sunset: moment(obj.Sunset).format('LT'),
                Maghrib:moment(obj.Maghrib).format('LT'),
                Isha: moment(obj.Isha).format('LT'),
                Midnight:moment(obj.Midnight).format('LT'),   
            }
        }      
        let swapPrayers= (x:any)=> R.assoc(x.prayerName,x.prayerTime,x)
        let removePrayers= (x:any)=> R.omit(['prayerName','prayerTime','undefined'],x)
        let prayerTime= R.pipe(swapPrayers,removePrayers)
        let prayerTimes =(x:any)=>R.map(prayerTime,x)
        let prayersList =(x:any)=> R.append({prayersDate:x.prayersDate},x.prayerTime)
        let projectPrayers= R.curry(sortObject)
        let pump =R.pipe(prayersList,prayerTimes,R.mergeAll,projectPrayers)
        return R.map(pump,prayers);
    }
    private async refreshPrayerManager(prayerConfig: prayerlib.IPrayersConfig, locationConfig: prayerlib.ILocationConfig): Promise<prayerlib.IPrayerManager> {
        let count: number = 0
        try {
            return await retry.default(async bail => {
                count += 1;
                debug(`the number is now reached ${count}`);
                let _prayerManager: prayerlib.IPrayerManager = await prayerlib.PrayerTimeBuilder
                    .createPrayerTimeBuilder(locationConfig, prayerConfig)
                    .createPrayerTimeManager();
                return _prayerManager;
            }
                , {
                    retries: 1,
                    minTimeout: 1000
                })
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    private async initializePrayerManger(): Promise<void> {
        try {
            let locationConfig: prayerlib.ILocationConfig = await new prayerlib.Configurator().getLocationConfig();
            let prayerConfig: prayerlib.IPrayersConfig = await new prayerlib.Configurator().getPrayerConfig();
            this._prayerManager = await this.refreshPrayerManager(prayerConfig, locationConfig);
        }
        catch (err) {
            debug(err);
            sentry.captureException(err);
            throw err;
        }
    }
    static getPrayerController(): PrayersController {

        return;

    }
}


