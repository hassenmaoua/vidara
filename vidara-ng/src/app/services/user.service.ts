import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authWS } from '../core/constants/api-endpoints';
import { UserDTO } from '../models/userDTO.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private readonly http: HttpClient) {}

    emailExists(email: string): Observable<boolean> {
        let params = new HttpParams().set('email', email);

        return this.http.get<boolean>(authWS.emailExists, { params });
    }

    updateProfile(body: UserDTO) {
        return this.http.post<UserDTO>(authWS.updateProfile, body);
    }

    changePassword(userId: number, oldPassword: string, newPassword: string) {
        const params = new HttpParams().set('userId', userId.toString()).set('oldPassword', oldPassword).set('newPassword', newPassword);

        return this.http.put<UserDTO>(authWS.changePassword, null, { params });
    }
}
