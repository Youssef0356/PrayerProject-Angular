import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrayerService } from '../../services/prayer.service';
import { NextPrayerInfo, PrayerDayData } from '../../models/prayer.model';
import { PrayerList } from '../../components/prayer-list/prayer-list';
import { NextPrayer } from '../../components/next-prayer/next-prayer';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [FormsModule, PrayerList, NextPrayer],
  templateUrl: './recherche.html',
  styleUrl: './recherche.css'
})
export class Recherche implements OnInit, OnDestroy {
  city: string = '';
  country: string = 'Tunisia';
  searchedLocation: string = '';

  status: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  dayData: PrayerDayData | null = null;
  nextPrayer: NextPrayerInfo | null = null;
  errorMessage: string = '';

  quickCities: string[] = ['Sfax', 'Tunis', 'Sousse', 'Monastir', 'Gabès'];

  private timerId: ReturnType<typeof setInterval> | null = null;
  private isDestroyed: boolean = false;

  constructor(
    private prayerService: PrayerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
  }

  search(): void {
    const cleanCity = this.city.trim();
    const cleanCountry = this.country.trim() || 'Tunisia';

    if (!cleanCity) {
      this.status = 'error';
      this.errorMessage = 'Veuillez saisir le nom d’une ville.';
      return;
    }

    this.status = 'loading';
    this.errorMessage = '';

    this.prayerService.getTimingsByCity(cleanCity, cleanCountry).subscribe({
      next: (response) => {
        if (this.isDestroyed) return;
        this.dayData = this.prayerService.extractPrayerDay(response);
        this.searchedLocation = `${cleanCity}, ${cleanCountry}`;
        this.status = 'ready';
        this.updateCountdown();
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.isDestroyed) return;
        this.status = 'error';
        this.errorMessage =
          'Impossible de trouver les horaires pour cette ville. Vérifiez le nom saisi.';
        this.cdr.detectChanges();
      }
    });
  }

  selectCity(cityName: string): void {
    this.city = cityName;
    this.country = 'Tunisia';
    this.search();
  }

  private updateCountdown(): void {
    if (!this.dayData || this.isDestroyed) return;
    this.nextPrayer = this.prayerService.getNextPrayer(this.dayData.prayers, new Date());
    this.cdr.detectChanges();
  }
}
