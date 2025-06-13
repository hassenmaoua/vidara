import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private readonly isLoading$ = new BehaviorSubject<boolean>(false);

    getLoadingStatus(): Observable<boolean> {
        return this.isLoading$.asObservable();
    }

    startLoading(): void {
        this.isLoading$.next(true);
    }

    stopLoading(): void {
        this.isLoading$.next(false);
    }
}
