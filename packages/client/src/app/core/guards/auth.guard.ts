import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    // TODO: Implementar lógica de autenticación real
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        router.navigate(['/users/login']);
        return false;
    }

    return true;
};
