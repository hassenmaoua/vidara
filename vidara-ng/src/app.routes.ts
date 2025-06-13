import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { HomeComponent } from './app/pages/home/home.component';
import { SubscriptionsComponent } from './app/pages/subscriptions/subscriptions.component';
import { ProfileComponent } from './app/pages/profile/profile.component';
import authRoutes from './app/pages/auth/auth.routes';
import { AuthGuard } from './app/pages/auth/auth.guard';

export const appRoutes: Routes = [
    authRoutes,
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'subscriptions', component: SubscriptionsComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            {
                path: ':username',
                component: ProfileComponent
                // children: [
                //     { path: '', component: AllContent },
                //     { path: 'videos', component: VideosContent },
                //     { path: 'images', component: ImagesContent }
                // ]
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
