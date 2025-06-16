import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessLevel, ContentDTO, ContentType } from '../models';
import { contentWS } from '../core/constants/api-endpoints';

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    last: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    constructor(private readonly http: HttpClient) {}

    createContent(formData: FormData): Observable<any> {
        return this.http.post(contentWS.createContent, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    loadContent(creatorIds: number[], contentType?: ContentType, accessLevel?: AccessLevel, page: number = 0, size: number = 10): Observable<PageResponse<ContentDTO>> {
        let params = new HttpParams().set('creatorIds', creatorIds.join(',')).set('page', page).set('size', size);

        if (contentType) {
            params = params.set('contentType', contentType);
        }

        if (accessLevel) {
            params = params.set('accessLevel', accessLevel);
        }

        return this.http.get<PageResponse<ContentDTO>>(contentWS.loadContent, { params });
    }

    updateContent(id: number, formData: FormData): Observable<any> {
        return this.http.put(contentWS.updateContent.replace('{0}', String(id)), formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    deleteContent(contentId: number): Observable<any> {
        return this.http.delete(contentWS.deleteContent.replace('{0}', String(contentId)));
    }
}
