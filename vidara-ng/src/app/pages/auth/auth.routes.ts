import { Route } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export default {
    path: 'auth',
    component: AuthComponent,
    children: [
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
} as Route;
