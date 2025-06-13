import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authWS } from '../core/constants/api-endpoints';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private readonly http: HttpClient) {}

    emailExists(email: string): Observable<boolean> {
        let params = new HttpParams().set('email', email);

        return this.http.get<boolean>(authWS.emailExists, { params });
    }
}
