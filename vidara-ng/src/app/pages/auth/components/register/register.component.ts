import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { catchError, first, forkJoin, Observable, of, Subject, takeUntil } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../auth.service';
import { LoadingService } from '../../../../services/loading.service';
import { StepperModule } from 'primeng/stepper';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        Dialog,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RouterModule,
        RippleModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconFieldModule,
        InputIconModule,
        DividerModule,
        StepperModule,
        SelectModule,
        DatePickerModule,
        RadioButtonModule
    ],
    templateUrl: './register.component.html',
    styleUrl: '../../styles.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm!: FormGroup;
    isLoading$: Observable<boolean>;
    visible = false;
    activeStep = 1;

    countries: any[] = [
        { name: 'Tunisia', code: 'TN' },
        { name: 'Algeria', code: 'DZ' },
        { name: 'Morocco', code: 'MA' },
        { name: 'Libya', code: 'LY' },
        { name: 'Mauritania', code: 'MR' }
    ];

    languages: any[] = [
        { name: 'العربية', value: 'AR', code: 'SA' },
        { name: 'English', value: 'EN', code: 'UK' },
        { name: 'Français', value: 'FR', code: 'FR' },
        { name: '日本語', value: 'JP', code: 'JP' }
    ];

    genders = [
        {
            label: 'Male',
            value: 'MALE'
        },
        {
            label: 'Female',
            value: 'FEMALE'
        }
    ];

    private readonly destroy$ = new Subject<void>();

    constructor(
        private readonly authService: AuthService,
        public router: Router,
        private readonly loadingService: LoadingService,
        private readonly fb: FormBuilder
    ) {
        this.isLoading$ = this.authService.isLoading$;
    }

    ngOnInit(): void {
        this.initForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    get f() {
        return this.registerForm.controls;
    }

    private initForm(): void {
        this.registerForm = this.fb.group({
            // Step 1 fields
            username: ['', Validators.required],
            email: ['', [Validators.required]], //Validators.email
            password: ['', Validators.required],
            rememberMe: [false, Validators.requiredTrue],

            // Step 2 fields
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            birthDate: [null, Validators.required],
            gender: ['', Validators.required],
            country: ['', Validators.required],
            language: ['EN', Validators.required]
        });
    }

    // Only proceed to next step if step 1 is valid
    activateCallback(step: number): void {
        if (step === 2 && !this.isStep1Valid()) {
            this.registerForm.markAllAsTouched();
            return;
        }

        if (step === 2 && this.isStep1Valid()) {
            const username = this.registerForm.controls['username'].value;
            const email = this.registerForm.controls['email'].value;

            forkJoin({
                usernameTaken: this.authService.usernameExists(username).pipe(
                    catchError(() => of(false)) // Optional: handle errors gracefully
                ),
                emailTaken: this.authService.emailExists(email).pipe(
                    catchError(() => of(false)) // Optional: handle errors gracefully
                )
            })
                .pipe(takeUntil(this.destroy$), first())
                .subscribe(({ usernameTaken, emailTaken }) => {
                    if (usernameTaken || emailTaken) {
                        // showError already handled inside service
                        return;
                    }

                    this.activeStep = step; // proceed only if both are not taken
                });

            return; // prevent the last line from running prematurely
        }

        this.activeStep = step; // default for other steps
    }
    isStep1Valid(): boolean {
        return (this.registerForm.get('username')?.valid && this.registerForm.get('email')?.valid && this.registerForm.get('password')?.valid) || false;
    }

    isStep2Valid(): boolean {
        return (
            (this.registerForm.get('firstName')?.valid &&
                this.registerForm.get('lastName')?.valid &&
                this.registerForm.get('birthDate')?.valid &&
                this.registerForm.get('gender')?.valid &&
                this.registerForm.get('country')?.valid &&
                this.registerForm.get('language')?.valid) ||
            false
        );
    }

    submit(): void {
        if (!this.isStep2Valid()) {
            this.registerForm.markAllAsTouched();
            return;
        }

        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        this.loadingService.startLoading();

        const formData = this.registerForm.value;

        this.authService
            .registration(formData)
            .pipe(takeUntil(this.destroy$), first())
            .subscribe({
                next: () => {
                    this.activeStep = 3; // Go to final screen
                    this.loadingService.stopLoading();
                },
                error: () => {
                    this.loadingService.stopLoading();
                    // Show error message
                }
            });
    }

    showTerms(): void {
        this.visible = true;
    }
}
