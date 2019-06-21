import Joi = require('@hapi/joi');
export declare type ValidtionTypes = any;
export declare enum ValidatorProviders {
    LocationValidator = "Validate Location",
    PrayerSettingsValidator = "Validate Prayer Settings",
    ConfigValidator = "Config Settings Validators"
}
interface IError {
    message: string;
    objectName: string;
    value: object;
}
export interface IValidationError extends Error {
    err: Error;
    details: Array<IError>;
    value: object;
}
export interface IValid<T extends ValidtionTypes> {
    validate(validateObject: T): boolean;
    isValid(): boolean;
    getValidationError(): IValidationError;
}
export declare abstract class Validator<T> implements IValid<T> {
    private _validatorName;
    private _valdationErrors;
    private _isValid;
    constructor(validatorName: string);
    isValid(): boolean;
    protected setIsValid(state: boolean): void;
    protected isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined;
    abstract validate(validateObject: T): boolean;
    validatorName: string;
    getValidationError(): IValidationError;
    protected setValidatonError(error: IValidationError): void;
    protected processErrorMessage(errors: any): Joi.ValidationErrorItem[];
    protected genericValidator(validateFn: Function): boolean;
    private processErrorMessages;
}
export {};
