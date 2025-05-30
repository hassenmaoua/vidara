import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PopoverModule } from 'primeng/popover';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MenuModule, BadgeModule, RippleModule, AvatarModule, DialogModule, PasswordModule, FloatLabelModule, ReactiveFormsModule, ButtonModule, PopoverModule],
    template: `
        <button class="layout-topbar-action layout-topbar-action-highlight" (click)="toggleMenu($event)">
            <i class="pi pi-user"></i>
            <span>Profile</span>
        </button>

        <p-menu #menu [model]="items" [popup]="true" styleClass="w-full md:w-60">
            <ng-template #start>
                <div pRipple class="flex flex-column items-center justify-start p-2 pt-4">
                    <p-avatar [label]="(user?.firstName?.slice(0, 1) || 'A').toUpperCase()" styleClass="mr-2" shape="circle" />

                    <span class="inline-flex flex-col">
                        <span class="font-bold">{{ user?.firstName }}</span>
                        <span class="text-sm">{{ user?.email }}</span>
                    </span>
                </div>
            </ng-template>
            <ng-template #submenuheader let-item>
                <span class="text-primary font-bold">{{ item.label }}</span>
            </ng-template>
            <ng-template #item let-item>
                <a pRipple class="flex items-center p-menu-item-link">
                    <span [ngClass]="item.styleClass" [class]="item.icon"></span>
                    <span [ngClass]="item.styleClass" class="ml-2">{{ item.label }}</span>
                    <p-badge *ngIf="item.badge" class="ml-auto" [value]="item.badge" />
                    <span *ngIf="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">
                        {{ item.shortcut }}
                    </span>
                </a>
            </ng-template>
        </p-menu>

        <p-dialog header="Change your password" [(visible)]="passwordVisible" [modal]="true" [style]="{ width: '25rem' }">
            <form [formGroup]="passwordForm" (ngSubmit)="submitPasswordChange()">
                <p-floatlabel variant="in">
                    <p-password id="oldPassword" formControlName="oldPassword" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                    <label for="oldPassword" class="font-semibold">Current password</label>
                </p-floatlabel>

                <p-floatlabel variant="in">
                    <p-password id="newPassword" formControlName="newPassword" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                    <label for="newPassword" class="font-semibold">New password</label>
                </p-floatlabel>

                <p-floatlabel variant="in">
                    <p-password id="cPassword" formControlName="cPassword" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                    <label for="cPassword" class="font-semibold">Confirm new password</label>
                </p-floatlabel>
            </form>
            <ng-template #footer>
                <p-button label="Cancel" severity="primary" [outlined]="true" [text]="true" [disabled]="isLoading$ | async" (click)="passwordVisible = false" />
                <p-button severity="primary" (click)="submitPasswordChange()" [loading]="isLoading$ | async" [label]="(isLoading$ | async) ? 'Please wait...' : 'Save'" />
            </ng-template>
        </p-dialog>

        <p-dialog header="Update profile" [(visible)]="settingsVisible" [modal]="true" [style]="{ width: 'auto', height: 'auto' }">
            <form [formGroup]="profileForm" (ngSubmit)="submitProfileUpdate()">
                <div class="grid md:grid-cols-2 gap-4"></div>

                <div class="flex gap-4 justify-end">
                    <p-button severity="primary" [outlined]="true" type="cancel" label="Cancel" (click)="this.settingsVisible = false" />
                    <p-button severity="primary" type="submit" [loading]="isLoading$ | async" [label]="(isLoading$ | async) ? 'Please wait...' : 'Save'"> </p-button>
                </div>
            </form>
        </p-dialog>
    `
})
export class AppProfile implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('menu') menu!: Menu;
    private readonly unsubscribe: Subscription[] = [];

    profileForm!: FormGroup;
    passwordForm!: FormGroup;

    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;

    items: MenuItem[] | undefined;
    passwordVisible: boolean = false;
    settingsVisible: boolean = false;
    name!: string;
    user: any | undefined;

    genderOptions = [
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' }
    ];

    constructor(private readonly renderer: Renderer2) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    ngOnInit() {
        this.initForm();
        this.items = [
            {
                separator: true
            },

            {
                label: 'Profile',
                items: [
                    {
                        label: 'Language',
                        icon: 'pi pi-language',
                        command: () => {
                            this.showSettingsDialog();
                        }
                    },
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        command: () => {
                            this.showSettingsDialog();
                        }
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-shield',
                        command: () => {
                            this.showPasswordDialog();
                        }
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        styleClass: 'text-red-500',
                        command: () => {
                            // this.authService.logout();
                        }
                    }
                ]
            }
        ];
    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((sub) => sub.unsubscribe());
    }

    ngAfterViewInit(): void {
        // this.user = this.authService.currentUser;
        this.user = { email: 'demo@email.com', firstName: 'demo', lastName: 'demo' };
    }

    initForm() {
        // TODO:
    }

    submitProfileUpdate() {
        // this.isLoadingSubject.next(true);
        // const { } = this.profileForm.value;
        // const subsc = this.userService
        //     .updateProfile({})
        //     .subscribe({
        //         next: (res: UserDTO) => {
        //             this.authService.currentUserSubject.next(res);
        //             this.isLoadingSubject.next(false);
        //             this.settingsVisible = false;
        //         },
        //         error: (error: any) => {
        //             console.error('failed:', error);
        //             this.isLoadingSubject.next(false);
        //         }
        //     });
        // this.unsubscribe.push(subsc);
    }

    submitPasswordChange() {
        // if (!this.user || this.passwordForm.invalid) {
        //     return;
        // }
        // this.isLoadingSubject.next(true);
        // const { oldPassword, newPassword } = this.passwordForm.value;
        // const subsc = this.userService.changePassword(this.user.id, oldPassword, newPassword).subscribe({
        //     next: (res: UserDTO) => {
        //         this.isLoadingSubject.next(false);
        //         this.passwordVisible = false;
        //         this.authService.logout();
        //     },
        //     error: (error: any) => {
        //         console.error('failed:', error);
        //         this.isLoadingSubject.next(false);
        //     }
        // });
        // this.unsubscribe.push(subsc);
    }

    showPasswordDialog() {
        this.passwordVisible = true;
    }

    showSettingsDialog() {
        this.settingsVisible = true;
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
