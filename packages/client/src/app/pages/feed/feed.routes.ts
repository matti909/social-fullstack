import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./posts/posts').then(m => m.Posts)
    }
];
