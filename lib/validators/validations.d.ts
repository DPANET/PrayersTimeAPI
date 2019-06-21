import * as validators from "@dpanet/prayers-lib/lib/validators/interface.validators";
import { IPrayerManager } from "@dpanet/prayers-lib/lib/managers/interface.manager";
export declare class PrayerMangerValidator extends validators.Validator<IPrayerManager> {
    private _prayerManagerSchema;
    private _adjustmentsSchema;
    private constructor();
    private setSchema;
    validate(validateObject: IPrayerManager): boolean;
    static createValidator(): validators.IValid<IPrayerManager>;
}
export * from "@dpanet/prayers-lib/lib/validators/interface.validators";
export * from "@dpanet/prayers-lib/lib/validators/validator";
