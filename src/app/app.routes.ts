import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { adminGuard } from './auth/admin-guard';
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

      // Admin-only route
      {
        path: 'create-user',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./user/user').then((m) => m.User),
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
