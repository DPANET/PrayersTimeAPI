import Joi = require('@hapi/joi');
import * as location from '../entities/location';
import * as prayer from '../entities/prayer';
import * as config from '../configurators/inteface.configuration';
import { Validator, IValid } from "./interface.validators";
export declare class LocationValidator extends Validator<location.ILocationSettings> {
    private _joiSchema;
    private constructor();
    validate(validateObject: location.ILocationSettings): boolean;
    static createValidator(): IValid<location.ILocationSettings>;
}
export declare class PrayerSettingsValidator extends Validator<prayer.IPrayersSettings> {
    private readonly _merger;
    private _joiSchema;
    _adjustmentsSchema: Joi.ObjectSchema;
    private constructor();
    validate(validateObject: prayer.IPrayersSettings): boolean;
    static createValidator(): IValid<prayer.IPrayersSettings>;
}
export declare class PrayerConfigValidator extends Validator<config.IPrayersConfig> {
    private _configSchema;
    private _adjustmentsSchema;
    private constructor();
    private setSchema;
    validate(validateObject: config.IPrayersConfig): boolean;
    static createValidator(): IValid<config.IPrayersConfig>;
}
export declare class LocationConfigValidator extends Validator<config.ILocationConfig> {
    private _configSchema;
    private _locationSchema;
    private _timeZoneSchema;
    private constructor();
    private setSchema;
    validate(validateObject: config.ILocationConfig): boolean;
    static createValidator(): IValid<config.ILocationConfig>;
}
