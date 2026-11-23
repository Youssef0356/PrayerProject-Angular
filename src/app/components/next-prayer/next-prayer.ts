import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-next-prayer',
  standalone: true,
  imports: [],
  templateUrl: './next-prayer.html',
  styleUrl: './next-prayer.css'
})
export class NextPrayer {
  @Input() prayerName: string = '';
  @Input() prayerTime: string = '';
  @Input() countdown: string = '';
}
