import { Component } from '@angular/core';

@Component({
  selector: 'app-a-propos',
  standalone: true,
  imports: [],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.css'
})
export class APropos {
  readonly author = 'Youssef Neji';

  readonly methods = [
    {
      name: 'Muslim World League (MWL)',
      detail: 'Utilisée par défaut dans cette application (méthode n° 3).'
    },
    {
      name: 'Egyptian General Authority of Survey',
      detail: 'Couramment utilisée en Afrique du Nord et au Moyen-Orient.'
    },
    {
      name: 'University of Islamic Sciences, Karachi',
      detail: 'Utilisée principalement en Asie du Sud.'
    },
    {
      name: 'Umm Al-Qura University, Makkah',
      detail: 'Méthode officielle utilisée en Arabie Saoudite.'
    }
  ];

  readonly notions = [
    'Composants Angular standalone et réutilisables',
    'Interpolation {{ }} et liaison de données [property]',
    'Gestion des événements utilisateur (click) et (ngSubmit)',
    'Directives de contrôle @if, @for et @switch',
    'Liaison bidirectionnelle avec ngModel (FormsModule)',
    'Communication parent-enfant avec @Input()',
    'Consommation d’une API REST via HttpClient et traitement JSON',
    'Routage Angular entre les pages Horaires, Recherche et À propos',
    'Géolocalisation du navigateur (navigator.geolocation)'
  ];
}
