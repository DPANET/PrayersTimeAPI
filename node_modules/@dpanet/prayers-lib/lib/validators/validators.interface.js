"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorProviders;
(function (ValidatorProviders) {
    ValidatorProviders["LocationValidator"] = "Validate Location";
    ValidatorProviders["PrayerSettingsValidator"] = "Validate Prayer Settings";
    ValidatorProviders["ConfigValidator"] = "Config Settings Validators";
})(ValidatorProviders = exports.ValidatorProviders || (exports.ValidatorProviders = {}));
;
;
class ValidationError {
    constructor(err) {
        this._err = err;
        this._name = err.name;
        this._message = err.message;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get err() {
        return this._err;
    }
    set err(value) {
        this._err = value;
    }
    get message() {
        return this._message;
    }
    set message(value) {
        this._message = value;
    }
    get details() {
        return this._details;
    }
    set details(value) {
        this._details = value;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
}
class Validator {
    constructor(validatorName) {
        this._validatorName = validatorName;
        this._isValid = false;
    }
    isValid() {
        return this._isValid;
    }
    setIsValid(state) {
        this._isValid = state;
    }
    isNullOrUndefined(obj) {
        return typeof obj === "undefined" || obj === null;
    }
    //   abstract  createValidator(): IValid<ValidtionTypes>;
    get validatorName() {
        return this._validatorName;
    }
    set validatorName(value) {
        this._validatorName = value;
    }
    getValidationError() {
        if (!this.isValid())
            return this._valdationErrors;
        else
            return null;
    }
    setValidatonError(error) {
        this._valdationErrors = error;
    }
    processErrorMessage(errors) {
        errors.map((err) => {
            switch (err.type) {
                case "date.base":
                    err.message = `${err.context.label} value is either not a date or could not be cast to a date from a string or a number`;
                    break;
                case "any.empty":
                    err.message = `${err.context.label} key value is empty, value should be within the list`;
                    break;
                case "date.max":
                    err.message = `${err.context.label} should not exceed ${err.context.limit}`;
                    break;
                case "any.allowOnly":
                    err.message = `${err.context.label} should be within the acceptable list of values`;
                    break;
                case "any.required":
                    err.message = `${err.context.label} is mandatory field`;
                    break;
                case "number.base":
                    err.message = `${err.context.label} expects integer`;
                    break;
                case "string.base":
                    err.message = `${err.context.label} expects string`;
                    break;
                case "array.includesOne":
                    err.message = `${err.context.label} expects a value not in the list`;
                    break;
                case "object.child":
                    err.message = `${err.context.label} expects a value not in the list`;
                    break;
                default:
                    err.message = `${err.type}: ${err.context.label} ${err.message} with value ${err.context}`;
            }
        });
        // console.log(errors);
        return errors;
    }
    genericValidator(validateFn) {
        let result, err, iErr;
        err = validateFn().error;
        if (!this.isNullOrUndefined(err)) {
            iErr = this.processErrorMessages(err);
            this.setIsValid(false);
            this.setValidatonError(iErr);
            return false;
        }
        else {
            this.setIsValid(true);
            return true;
        }
    }
    processErrorMessages(err) {
        let validationError = new ValidationError(err);
        let details = new Array();
        validationError.value = err._object;
        err.details.forEach(element => {
            details.push({ message: element.message, objectName: element.type, value: element.context });
        });
        validationError.details = details;
        return validationError;
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validators.interface.js.map