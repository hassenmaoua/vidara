import { Pipe, PipeTransform } from '@angular/core';
import { contentWS } from '../core/constants/api-endpoints';

@Pipe({
    name: 'storageUrl',
    standalone: true
})
export class StorageUrlPipe implements PipeTransform {
    transform(filename?: string): string {
        if (!filename) return '';
        return contentWS.STORAGE_URL.replace('{0}', filename);
    }
}
