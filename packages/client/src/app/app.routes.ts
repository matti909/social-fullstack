import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'users' },
    {
        path: 'users',
        loadChildren: () => import('./pages/users/users.routes').then(m => m.routes)
    },
    {
        path: 'feed',
        canActivate: [authGuard],
        loadChildren: () => import('./pages/feed/feed.routes').then(m => m.routes)
    },
    {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
    }
];
