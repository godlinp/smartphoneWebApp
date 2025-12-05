import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Smartphones } from './components/smartphones/smartphones';
import { Notfound } from './components/notfound/notfound';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'smartphones', component: Smartphones },
  { path: '**', component: Notfound },
];


