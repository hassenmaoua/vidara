import { AfterViewInit, Component, inject, Renderer2, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AuthService } from '../../pages/auth/auth.service';
import { UserDTO } from '../../models/userDTO.model';
import { Menu, MenuModule } from 'primeng/menu';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
    label: string;
    value: string;
    code: string;
}

@Component({
    selector: 'app-language',
    imports: [ButtonModule, StyleClassModule, MenuModule],
    template: `
        <button class="layout-topbar-action" (mouseenter)="toggleMenu($event)" (click)="toggleMenu($event)" [disabled]="true">
            <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [alt]="'flag'" [class]="'flag flag-' + language?.code?.toLocaleLowerCase()" style="width: 18px" />
        </button>
        <p-menu #menu [model]="languages" [popup]="true" styleClass="">
            <ng-template #item let-item>
                <a pRipple class="flex items-center p-menu-item-link">
                    <img src="https://primefaces.org/cdn/primeng/images/demo/flag/flag_placeholder.png" [alt]="'flag'" [class]="'flag flag-' + item.code.toLocaleLowerCase()" style="width: 18px" />

                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </ng-template>
        </p-menu>
    `
})
export class AppLanguage implements AfterViewInit {
    @ViewChild('menu') menu!: Menu;

    user: UserDTO | undefined;

    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    languages: Language[] = [
        { label: 'العربية', value: 'AR', code: 'SA' },
        { label: 'English', value: 'EN', code: 'UK' },
        { label: 'Français', value: 'FR', code: 'FR' },
        { label: '日本語', value: 'JP', code: 'JP' }
    ];

    language: Language | undefined;

    constructor(
        private readonly renderer: Renderer2,
        private readonly authService: AuthService
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngAfterViewInit(): void {
        this.user = this.authService.currentUser;
        this.language = this.languages.filter((lang) => lang.value == this.user?.language)[0];
    }

    toggleMenu(event: MouseEvent) {
        this.menu.toggle(event);

        setTimeout(() => {
            const menuElement = document.querySelector('.p-menu') as HTMLElement;

            if (menuElement) {
                if (this.menu.visible) {
                    this.renderer.setStyle(menuElement, 'top', '3.5rem');
                }
            }
        }, 0);
    }
}
