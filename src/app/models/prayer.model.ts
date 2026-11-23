export type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerItem {
  key: PrayerKey;
  label: string;
  time: string;
}

export interface AlAdhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
}

export interface AlAdhanResponse {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      gregorian: {
        date: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
      };
      hijri: {
        date: string;
        day: string;
        weekday: { en: string; ar: string };
        month: { number: number; en: string; ar: string };
        year: string;
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
  };
}

export interface PrayerDayData {
  gregorianDate: string;
  hijriDate: string;
  prayers: PrayerItem[];
  sunrise: string;
  sunset: string;
  timezone: string;
}

export interface NextPrayerInfo {
  key: PrayerKey;
  label: string;
  time: string;
  countdown: string;
}
