import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./signup/signup').then(m => m.Signup)
    },
    {
        path: 'profile/:userId',
        loadComponent: () => import('./profile/profile').then(m => m.Profile)
    }
];
