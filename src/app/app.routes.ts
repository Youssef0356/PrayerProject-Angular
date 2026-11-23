import { Routes } from '@angular/router';
import { Horaires } from './pages/horaires/horaires';
import { Recherche } from './pages/recherche/recherche';
import { APropos } from './pages/a-propos/a-propos';

export const routes: Routes = [
  { path: '', redirectTo: 'horaires', pathMatch: 'full' },
  { path: 'horaires', component: Horaires },
  { path: 'recherche', component: Recherche },
  { path: 'a-propos', component: APropos },
  { path: '**', redirectTo: 'horaires' }
];
