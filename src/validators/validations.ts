import * as validators from  "@dpanet/prayers-lib/lib/validators/interface.validators";
import {IPrayerManager} from "@dpanet/prayers-lib/lib/managers/interface.manager";
//import * as prayer from "@dpanet/prayers-lib/lib/entities/prayer";
import Joi = require('@hapi/joi');
export class PrayerMangerValidator extends validators.Validator<IPrayerManager>
{

    private _prayerManagerSchema: object;
    private _adjustmentsSchema: object;
    private constructor() 
    {
       super("PrayerManagerValidator");
       this.setSchema();

    }
    private setSchema(): void {

        this._prayerManagerSchema = Joi.any()
        .required()
        .label("Prayer Manager")
        .error(this.processErrorMessage);
    }
    public validate(validateObject: IPrayerManager): boolean {
        return  super.genericValidator( Joi.validate(validateObject, this._prayerManagerSchema, { abortEarly: false, allowUnknown: true }));
    }
    public static createValidator(): validators.IValid<IPrayerManager> {
        return new PrayerMangerValidator();
    }
}
export * from  "@dpanet/prayers-lib/lib/validators/interface.validators";
export * from "@dpanet/prayers-lib/lib/validators/validator";