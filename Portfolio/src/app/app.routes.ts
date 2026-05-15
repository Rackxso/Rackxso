import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/home/home').then(m => m.Home)
    },
    {
        path: 'about',
        loadComponent: () => import('./components/about/about').then(m => m.About)
    },
    {
        path: 'skill',
        loadComponent: () => import('./components/skills/skills').then(m => m.Skills)
    },
    {
        path: 'projects',
        loadComponent: () => import('./components/projects/projects').then(m => m.Projects)
    },
    {
        path: 'contact',
        loadComponent: () => import('./components/contact/contact').then(m => m.Contact)
    },
    {
        path: 'projects/live-notes',
        loadComponent: () => import('./components/proyectos/live-notes/live-notes').then(m => m.LiveNotes)
    },
    {
        path: 'projects/cyclepath',
        loadComponent: () => import('./components/proyectos/cyclepath/cyclepath').then(m => m.Cyclepath)
    },
];
