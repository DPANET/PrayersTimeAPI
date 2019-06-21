import { PrayersName } from "@dpanet/prayers-lib/lib/entities/prayer";
export interface IPrayersView {
    prayersDate: string;
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Midnight: string;
    Imsak?: string;
}
export interface IPrayersViewRow {
    prayersDate: string;
    prayerTime: string;
    prayerName: PrayersName;
}
