import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AlAdhanResponse,
  NextPrayerInfo,
  PrayerDayData,
  PrayerItem
} from '../models/prayer.model';

@Injectable({
  providedIn: 'root'
})
export class PrayerService {
  private readonly baseUrl = 'https://api.aladhan.com/v1';

  private readonly frenchWeekdays: Record<string, string> = {
    Monday: 'Lundi',
    Tuesday: 'Mardi',
    Wednesday: 'Mercredi',
    Thursday: 'Jeudi',
    Friday: 'Vendredi',
    Saturday: 'Samedi',
    Sunday: 'Dimanche'
  };

  private readonly frenchMonths = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
  ];

  private readonly hijriMonths = [
    'Mouharram',
    'Safar',
    'Rabia al-awal',
    'Rabia al-thani',
    'Joumada al-oula',
    'Joumada al-akhira',
    'Rajab',
    'Chaabane',
    'Ramadan',
    'Chawwal',
    "Dhou al-qi'da",
    'Dhou al-hijja'
  ];

  constructor(private http: HttpClient) {}

  getTimingsByCity(city: string, country: string = 'Tunisia'): Observable<AlAdhanResponse> {
    const params = new HttpParams()
      .set('city', city.trim())
      .set('country', country.trim())
      .set('method', '3');

    return this.http.get<AlAdhanResponse>(`${this.baseUrl}/timingsByCity`, { params });
  }

  getTimingsByCoords(latitude: number, longitude: number): Observable<AlAdhanResponse> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString())
      .set('method', '3');

    return this.http.get<AlAdhanResponse>(`${this.baseUrl}/timings`, { params });
  }

  extractPrayerDay(response: AlAdhanResponse): PrayerDayData {
    const { timings, date, meta } = response.data;

    const prayers: PrayerItem[] = [
      { key: 'Fajr', label: 'Fajr', time: this.cleanTime(timings.Fajr) },
      { key: 'Dhuhr', label: 'Dhuhr', time: this.cleanTime(timings.Dhuhr) },
      { key: 'Asr', label: 'Asr', time: this.cleanTime(timings.Asr) },
      { key: 'Maghrib', label: 'Maghrib', time: this.cleanTime(timings.Maghrib) },
      { key: 'Isha', label: 'Isha', time: this.cleanTime(timings.Isha) }
    ];

    const weekdayFr = this.frenchWeekdays[date.gregorian.weekday.en] ?? date.gregorian.weekday.en;
    const monthFr =
      this.frenchMonths[date.gregorian.month.number - 1] ?? date.gregorian.month.en;
    const dayNumber = Number(date.gregorian.day);
    const gregorianDate = `${weekdayFr} ${dayNumber} ${monthFr} ${date.gregorian.year}`;

    const hijriMonthFr =
      this.hijriMonths[date.hijri.month.number - 1] ?? date.hijri.month.en;
    const hijriDay = Number(date.hijri.day);
    const hijriDate = `${hijriDay} ${hijriMonthFr} ${date.hijri.year}`;

    return {
      gregorianDate,
      hijriDate,
      prayers,
      sunrise: this.cleanTime(timings.Sunrise),
      sunset: this.cleanTime(timings.Sunset),
      timezone: meta.timezone
    };
  }

  getNextPrayer(prayers: PrayerItem[], now: Date = new Date()): NextPrayerInfo | null {
    if (prayers.length === 0) {
      return null;
    }

    const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (const prayer of prayers) {
      const prayerSeconds = this.toSeconds(prayer.time);
      if (prayerSeconds > nowSeconds) {
        return {
          key: prayer.key,
          label: prayer.label,
          time: prayer.time,
          countdown: this.formatDuration(prayerSeconds - nowSeconds)
        };
      }
    }

    const fajr = prayers[0];
    const fajrSeconds = this.toSeconds(fajr.time);
    const remaining = 24 * 3600 - nowSeconds + fajrSeconds;

    return {
      key: fajr.key,
      label: fajr.label,
      time: fajr.time,
      countdown: this.formatDuration(remaining)
    };
  }

  private cleanTime(raw: string): string {
    return raw.split(' ')[0];
  }

  private toSeconds(hhmm: string): number {
    const [hours, minutes] = hhmm.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  }

  private formatDuration(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${this.pad(hours)}h ${this.pad(minutes)}min ${this.pad(seconds)}s`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
