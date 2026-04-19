import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public route (NO sidebar)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },

  // Protected routes WITH sidebar
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      // // future routes
      // {
      //   path: 'customers',
      //   loadComponent: () => import('./customers/customers').then((m) => m.CustomersComponent),
      // },
      // {
      //   path: 'orders',
      //   loadComponent: () => import('./orders/orders').then((m) => m.OrdersComponent),
      // },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
