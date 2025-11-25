import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        return router.createUrlTree(['/login']);
    }

    const user = JSON.parse(userStr);

    // Verifica se o usuário está tentando acessar uma rota compatível com seu tipo
    if (state.url.includes('admin') && user.type !== 'admin') {
        return router.createUrlTree(['/doctor/dashboard']);
    }

    if (state.url.includes('doctor') && user.type !== 'doctor') {
        return router.createUrlTree(['/admin/dashboard']);
    }

    return true;
};
