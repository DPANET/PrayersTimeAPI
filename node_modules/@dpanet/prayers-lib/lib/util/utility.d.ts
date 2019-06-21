export declare class DateUtil {
    static getEndofDate(endDate: Date): Date;
    static addDay(days: number, dateNow: Date): Date;
    static addMinutes(date: Date, minutes: number): Date;
    private static readonly format;
    static getTime(date: string, time: string): Date;
    static getNowDate(): Date;
    static getNowTime(): Date;
    static getYear(date: Date): any;
    static getMonth(date: Date): number;
    static addMonth(months: number, date: Date): Date;
    static dayMatch(dateLeft: Date, dateRight: Date): boolean;
    static formatDate(date: string): Date;
    static getDateByTimeZone(date: Date, timeZone: string): string;
    static getStartOfDay(date: Date): Date;
    static getMonthsDifference(startDate: Date, endDate: Date): number;
}
