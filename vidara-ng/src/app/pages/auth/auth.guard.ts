import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private readonly router = inject(Router);

    constructor(private readonly authService: AuthService) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        // First check if we have a cached currentUser
        if (!this.authService.currentUser) {
            await this.authService.getUserByToken();
        }

        // User is not authenticated at all
        if (!this.authService.currentUser) {
            return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }

        // All other cases - allow access
        return true;
    }
}
