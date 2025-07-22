// src/app/guards/role.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getUserRole();
    if (auth.isLoggedIn() && role === expectedRole) {
      return true;
    }

    return router.parseUrl('/unauthorized'); // o redirige a /home si prefieres
  };
}
