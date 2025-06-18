import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, lastValueFrom, map, Observable, of, Subscription, switchMap, take, throwError } from 'rxjs';
import { UserDTO } from '../../models/userDTO.model';
import { authWS } from '../../core/constants/api-endpoints';
import { Router } from '@angular/router';
import { AuthModel } from './models/auth.model';
import { environment } from 'src/environment/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // private fields
    private readonly unsubscribe: Subscription[] = [];
    private readonly authStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    // public fields
    currentUser$: Observable<UserDTO | undefined>;
    isLoading$: Observable<boolean>;

    currentUserSubject: BehaviorSubject<UserDTO | undefined> = new BehaviorSubject<UserDTO | undefined>(undefined);
    isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    hasErrorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    errorMessage: BehaviorSubject<string> = new BehaviorSubject('');

    errorImage: string = 'assets/images/angle-triangle.png';

    get currentUser(): UserDTO | undefined {
        return this.currentUserSubject.value;
    }

    set currentUser(user: UserDTO) {
        this.currentUserSubject.next(user);
    }

    constructor(
        private readonly http: HttpClient,
        private readonly router: Router
        // private readonly cookieService: CookieService
    ) {
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
    }

    // public methods
    login(email: string, password: string, staySignedIn: boolean): Observable<UserDTO | undefined> {
        this.isLoadingSubject.next(true);
        return this.http
            .post<AuthModel>(authWS.login, {
                email,
                password
            })
            .pipe(
                map((auth: AuthModel) => {
                    if (auth?.authToken) {
                        localStorage.setItem(this.authStorageToken, auth.authToken);
                    }
                }),
                switchMap(() => this.getUserByToken()),
                catchError((err) => {
                    console.error('err', err);
                    return of(undefined);
                }),
                finalize(() => this.isLoadingSubject.next(false))
            );
    }

    async logout(returnUrl?: string): Promise<void> {
        // Clear cookie storage
        localStorage.removeItem(this.authStorageToken);

        // Reset current user
        this.currentUserSubject.next(undefined);
        location.reload();

        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: returnUrl }
        });
    }

    async getUserByToken(): Promise<UserDTO | undefined> {
        const token = this.getAuthFromLocalStorage();
        if (!token) {
            return undefined;
        }

        this.isLoadingSubject.next(true);

        try {
            const user = await lastValueFrom(
                this.http.post<UserDTO>(`${authWS.verifyToken}?token=${token}`, null).pipe(
                    take(1) // Ensure the observable completes
                )
            );

            if (user) {
                this.currentUserSubject.next(user);
                return user;
            } else {
                await this.logout();
                return undefined;
            }
        } catch (error) {
            console.error('Failed to get user by token:', error);
            await this.logout();
            return undefined;
        } finally {
            this.isLoadingSubject.next(false);
        }
    }

    // need create new user then login
    registration(form: FormData): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.http.post<any>(authWS.register, form).pipe(
            map((response) => response),
            catchError((err: HttpErrorResponse) => {
                const message = err?.error?.message ?? 'Unknown error during registration';
                this.showError(message);
                return throwError(() => new Error(message)); // propagate error as Error
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    emailExists(email: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        let params = new HttpParams().set('email', email);

        return this.http.get<boolean>(authWS.emailExists, { params }).pipe(
            map((response) => {
                if (response === true) {
                    this.showError('Email already taken!');
                }
                return response;
            }),
            catchError((err: HttpErrorResponse) => {
                const message = err?.error?.message ?? 'Unknown error';
                this.showError(message);
                return throwError(() => new Error(message));
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    usernameExists(username: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        let params = new HttpParams().set('username', username);

        return this.http.get<boolean>(authWS.usernameExists, { params }).pipe(
            map((response) => {
                if (response === true) {
                    this.showError('Username already taken!');
                }
                return response;
            }),
            catchError((err: HttpErrorResponse) => {
                const message = err?.error?.message ?? 'Unknown error';
                return throwError(() => new Error(message));
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    // changePassword(token: string, password: any) {
    //     this.isLoadingSubject.next(true);
    //     return this.authHttpService.changePassword({ token, password }).pipe(finalize(() => this.isLoadingSubject.next(false)));
    // }

    showError(message: string) {
        this.errorMessage.next(message);
        this.hasErrorSubject.next(true);
    }

    closeError() {
        this.hasErrorSubject.next(false);
        this.errorMessage.next('');
    }

    getAuthFromLocalStorage(): string | undefined {
        try {
            const lsValue = localStorage.getItem(this.authStorageToken);
            if (!lsValue) {
                return undefined;
            }
            return lsValue;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    getUserByUsername(username: string): Observable<UserDTO> {
        return this.http.get<UserDTO>(authWS.getByUsername.replace('{username}', username));
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
