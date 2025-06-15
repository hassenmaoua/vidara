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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '../../pages/auth/auth.service';
import { UserDTO } from '../../models/userDTO.model';
import { StorageUrlPipe } from '../../pipes/storage-url.pipe';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MenuModule,
        BadgeModule,
        RippleModule,
        AvatarModule,
        DialogModule,
        PasswordModule,
        FloatLabelModule,
        ReactiveFormsModule,
        ButtonModule,
        PopoverModule,
        StorageUrlPipe,
        SelectModule,
        RadioButtonModule,
        DatePickerModule,
        InputTextModule
    ],
    template: `
        <button class="layout-topbar-action layout-topbar-action-highlight" (click)="toggleMenu($event)">
            <img *ngIf="user?.avatar; else icon" [src]="user?.avatar | storageUrl" alt="img" class="rounded-full" styleClass="-m-2" />
            <ng-template #icon>
                <i class="pi pi-user"></i>
            </ng-template>

            <span>Profile</span>
        </button>

        <p-menu #menu [model]="items" [popup]="true" styleClass="w-full md:w-60">
            <ng-template #start>
                <div pRipple class="flex flex-column items-center justify-start p-2 pt-4">
                    <p-avatar *ngIf="user?.avatar; else initial" [image]="user?.avatar | storageUrl" styleClass="mr-2" shape="circle"> </p-avatar>
                    <ng-template #initial>
                        <p-avatar [label]="user?.fullName?.toLocaleUpperCase()?.toLocaleUpperCase()?.charAt(0) || '?'" styleClass="mr-2" shape="circle"> </p-avatar>
                    </ng-template>
                    <span class="inline-flex flex-col">
                        <span class="font-bold">{{ user?.fullName }}</span>
                        <span class="text-sm">{{ user?.username }}</span>
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

        <p-dialog header="Update profile" [(visible)]="settingsVisible" [modal]="true" [style]="{ width: '50vw', height: '75vh' }">
            <form [formGroup]="profileForm" (ngSubmit)="submitProfileUpdate()" [style]="{ height: '100%' }" class="flex flex-col justify-between">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="">
                        <label for="firstName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">First Name</label>
                        <input pInputText id="firstName" type="text" placeholder="First Name" class="w-full mb-1" formControlName="firstName" [ngClass]="{ 'p-invalid': profileF['firstName'].touched && profileF['firstName'].errors }" />
                        <small *ngIf="profileF['firstName'].errors?.['required'] && profileF['firstName'].touched" class="p-error">First name is required</small>
                    </div>
                    <div class="">
                        <label for="lastName" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Last Name</label>
                        <input pInputText id="lastName" type="text" placeholder="Last Name" class="w-full mb-1" formControlName="lastName" [ngClass]="{ 'p-invalid': profileF['lastName'].touched && profileF['lastName'].errors }" />
                        <small *ngIf="profileF['lastName'].errors?.['required'] && profileF['lastName'].touched" class="p-error">Last name is required</small>
                    </div>

                    <div class="">
                        <label for="birthDate" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Birth Date</label>

                        <p-datepicker id="birthDate" formControlName="birthDate" placeholder="yyyy-mm-dd" [iconDisplay]="'input'" [showIcon]="true" dateFormat="yy-mm-dd" inputId="icondisplay" fluid> </p-datepicker>
                        <small *ngIf="profileF['birthDate'].errors?.['required'] && profileF['birthDate'].touched" class="p-error">Birthdate is required</small>
                    </div>
                    <div class="">
                        <label for="gender" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Gender</label>

                        <div id="gender" class="flex flex-wrap gap-3 mt-2">
                            <div class="flex items-center" *ngFor="let btn of genders">
                                <p-radioButton [id]="btn.label" [name]="'gender'" [value]="btn.value" formControlName="gender" />
                                <label [for]="btn.label" class="ml-2">{{ btn.label }}</label>
                            </div>
                        </div>

                        <small *ngIf="profileF['gender'].errors?.['required'] && profileF['gender'].touched" class="p-error">Gender is required</small>
                    </div>

                    <div class="">
                        <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <input pInputText id="username" type="text" placeholder="Username" class="w-full mb-1" formControlName="username" [ngClass]="{ 'p-invalid': profileF['username'].touched && profileF['username'].errors }" />
                        <small *ngIf="profileF['username'].errors?.['required'] && profileF['username'].touched" class="p-error">First name is required</small>
                    </div>
                    <div class="">
                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <input pInputText id="email" type="text" placeholder="Email" class="w-full mb-1" formControlName="email" [ngClass]="{ 'p-invalid': profileF['email'].touched && profileF['email'].errors }" />
                        <small *ngIf="profileF['email'].errors?.['required'] && profileF['email'].touched" class="p-error">Last name is required</small>
                    </div>
                </div>
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
    user: UserDTO | undefined;

    countries: any[] = [
        { name: 'Tunisia', code: 'TN' },
        { name: 'Algeria', code: 'DZ' },
        { name: 'Morocco', code: 'MA' },
        { name: 'Libya', code: 'LY' },
        { name: 'Mauritania', code: 'MR' }
    ];

    genders: any[] = [
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' }
    ];

    constructor(
        private readonly renderer: Renderer2,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly fb: FormBuilder,
        private readonly router: Router
    ) {
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
                        label: 'My profile',
                        icon: 'pi pi-user',
                        command: () => {
                            this.router.navigate(['/' + this.authService.currentUser?.username]);
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
                        separator: true
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        styleClass: 'text-red-500',
                        command: () => {
                            this.authService.logout();
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
        this.user = this.authService.currentUser;

        // Loop through each form control and set its value if the user has a matching property
        Object.keys(this.profileForm.controls).forEach((key) => {
            if (this.user && this.isUserKey(key)) {
                this.profileForm.controls[key].setValue(this.user[key]);
            }
        });
    }

    isUserKey(key: string): key is keyof UserDTO {
        return key in (this.user || {});
    }

    private initForm(): void {
        this.profileForm = this.fb.group({
            firstName: [this.user?.firstName, Validators.required],
            lastName: [this.user?.lastName, Validators.required],
            birthDate: [null, Validators.required],
            gender: [this.user?.gender, Validators.required],
            username: [this.user?.username, Validators.required],
            email: [this.user?.email, Validators.required]
        });
    }
    get profileF() {
        return this.profileForm.controls;
    }

    get passwordF() {
        return this.passwordForm.controls;
    }

    submitProfileUpdate() {
        this.isLoadingSubject.next(true);
        const formValues = this.profileForm.value;
        const subsc = this.userService.updateProfile(formValues).subscribe({
            next: (res: UserDTO) => {
                this.authService.currentUserSubject.next(res);
                this.isLoadingSubject.next(false);
                this.settingsVisible = false;
            },
            error: (error: any) => {
                console.error('failed:', error);
                this.isLoadingSubject.next(false);
            }
        });
        this.unsubscribe.push(subsc);
    }

    submitPasswordChange() {
        if (!this.user || this.passwordForm.invalid) {
            return;
        }
        this.isLoadingSubject.next(true);
        const { oldPassword, newPassword } = this.passwordForm.value;
        const subsc = this.userService.changePassword(this.user.id, oldPassword, newPassword).subscribe({
            next: (res: UserDTO) => {
                this.isLoadingSubject.next(false);
                this.passwordVisible = false;
                this.authService.logout();
            },
            error: (error: any) => {
                console.error('failed:', error);
                this.isLoadingSubject.next(false);
            }
        });
        this.unsubscribe.push(subsc);
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
