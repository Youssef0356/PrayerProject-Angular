import { Component, Input } from '@angular/core';
import { PrayerItem } from '../../models/prayer.model';

@Component({
  selector: 'app-prayer-list',
  standalone: true,
  imports: [],
  templateUrl: './prayer-list.html',
  styleUrl: './prayer-list.css'
})
export class PrayerList {
  @Input() prayers: PrayerItem[] = [];
  @Input() nextPrayerKey: string = '';
}
