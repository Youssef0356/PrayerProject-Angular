import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PrayerService } from '../../services/prayer.service';
import { NextPrayerInfo, PrayerDayData } from '../../models/prayer.model';
import { PrayerList } from '../../components/prayer-list/prayer-list';
import { NextPrayer } from '../../components/next-prayer/next-prayer';

@Component({
  selector: 'app-horaires',
  standalone: true,
  imports: [PrayerList, NextPrayer],
  templateUrl: './horaires.html',
  styleUrl: './horaires.css'
})
export class Horaires implements OnInit, OnDestroy {
  status: 'loading' | 'ready' | 'error' = 'loading';
  cityLabel: string = 'Sfax, Tunisie';
  dayData: PrayerDayData | null = null;
  nextPrayer: NextPrayerInfo | null = null;

  latitude: number | null = null;
  longitude: number | null = null;
  geoLoading: boolean = false;
  geoMessage: string = '';
  errorMessage: string = '';

  private timerId: ReturnType<typeof setInterval> | null = null;
  private isDestroyed: boolean = false;

  constructor(
    private prayerService: PrayerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDefaultCity();
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

  loadDefaultCity(): void {
    this.status = 'loading';
    this.errorMessage = '';
    this.geoMessage = '';
    this.latitude = null;
    this.longitude = null;
    this.cityLabel = 'Sfax, Tunisie';

    this.prayerService.getTimingsByCity('Sfax', 'Tunisia').subscribe({
      next: (response) => {
        if (this.isDestroyed) return;
        this.dayData = this.prayerService.extractPrayerDay(response);
        this.status = 'ready';
        this.updateCountdown();
        this.cdr.detectChanges();
      },
      error: () => {
        if (this.isDestroyed) return;
        this.status = 'error';
        this.errorMessage = 'Impossible de charger les horaires de prière pour Sfax.';
        this.cdr.detectChanges();
      }
    });
  }

  useGeolocation(): void {
    if (!navigator.geolocation) {
      this.geoMessage = "La géolocalisation n'est pas prise en charge par ce navigateur.";
      return;
    }

    this.geoLoading = true;
    this.geoMessage = '';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.isDestroyed) return;
        const lat = Number(position.coords.latitude.toFixed(4));
        const lng = Number(position.coords.longitude.toFixed(4));

        this.latitude = lat;
        this.longitude = lng;
        this.status = 'loading';
        this.cdr.detectChanges();

        this.prayerService.getTimingsByCoords(lat, lng).subscribe({
          next: (response) => {
            if (this.isDestroyed) return;
            this.dayData = this.prayerService.extractPrayerDay(response);
            this.cityLabel = 'Position actuelle (GPS)';
            this.geoLoading = false;
            this.status = 'ready';
            this.updateCountdown();
            this.cdr.detectChanges();
          },
          error: () => {
            if (this.isDestroyed) return;
            this.geoLoading = false;
            this.status = 'error';
            this.errorMessage = 'Erreur lors de la récupération des horaires pour votre position.';
            this.cdr.detectChanges();
          }
        });
      },
      (err) => {
        if (this.isDestroyed) return;
        this.geoLoading = false;
        if (err.code === err.PERMISSION_DENIED) {
          this.geoMessage = 'Autorisation de géolocalisation refusée.';
        } else {
          this.geoMessage = "Impossible d'obtenir votre position actuelle.";
        }
        this.cdr.detectChanges();
      },
      { timeout: 10000 }
    );
  }

  private updateCountdown(): void {
    if (!this.dayData || this.isDestroyed) return;
    this.nextPrayer = this.prayerService.getNextPrayer(this.dayData.prayers, new Date());
    this.cdr.detectChanges();
  }
}
