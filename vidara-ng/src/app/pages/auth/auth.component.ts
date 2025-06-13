import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { Image } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { AppConfigurator } from '../../layout/component/app.configurator';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [ButtonModule, RouterModule, CommonModule, Dialog, Image, AppConfigurator],
    template: `
        <div class="overflow-hidden">
            <div *ngIf="isLogin" class="flex flex-col md:flex-row min-h-screen bg-surface-50 dark:bg-surface-950">
                <!-- Left or Right Image -->
                <div *ngIf="isLogin" class="w-full md:w-1/2 flex items-center justify-center p-0">
                    <img src="assets/images/vidara_poster.webp" alt="vidara" style="height: 100vh;" class="max-w-full" />
                </div>

                <!-- Auth Form -->
                <div class="w-full md:w-1/2 flex items-center justify-center p-0">
                    <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                            <router-outlet [attr.key]="routeKey"></router-outlet>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No image for other /auth/** subroutes -->
            <div *ngIf="!isLogin" class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%);" class="md:min-w-[50vw]">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <router-outlet [attr.key]="routeKey"></router-outlet>
                    </div>
                </div>
            </div>
        </div>

        <app-configurator />
        <p-dialog [visible]="(hasError$ | async) ?? false" [modal]="true" [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }" [style]="{ width: '30rem' }" [draggable]="false" [resizable]="false" [closeOnEscape]="true" (onHide)="closeErrorDialog()">
            <div class="flex flex-col items-center text-center p-4">
                <div class="w-24 h-24 mb-4">
                    <p-image [src]="errorImage" alt="Error Triangle" class="w-full h-full object-contain" />
                </div>

                <h3 class="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong</h3>
                <p class="text-gray-700 mb-6">{{ errorMessage$ | async }}</p>

                <button pButton type="button" label="Close" icon="pi pi-check" class="p-button-rounded p-button-danger" (click)="closeErrorDialog()"></button>
            </div>
        </p-dialog>
    `
})
export class AuthComponent {
    private readonly authService = inject(AuthService);
    routeKey = 0;
    currentPath = '';
    isLogin = false;

    constructor(private readonly router: Router) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
            this.currentPath = e.urlAfterRedirects;
            this.isLogin = this.currentPath.includes('/auth/login');
            this.routeKey++; // changes the key to force reload
        });
    }

    hasError$ = this.authService.hasErrorSubject.asObservable();
    errorMessage$ = this.authService.errorMessage.asObservable();

    errorImage = this.authService.errorImage;

    closeErrorDialog() {
        this.authService.closeError();
    }
}
