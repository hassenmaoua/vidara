import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) {}

    transform(value: string): SafeResourceUrl {
        // Append autoplay=0 only if it's not already present
        if (!value.includes('autoplay=')) {
            value += (value.includes('?') ? '&' : '?') + 'autoplay=0';
        }

        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}
