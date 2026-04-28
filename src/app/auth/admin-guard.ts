import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './AuthService';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();
  console.log(user);

  if (user?.role === 'Admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
