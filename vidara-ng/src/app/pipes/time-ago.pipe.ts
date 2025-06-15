import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
    standalone: true
})
export class TimeAgoPipe implements PipeTransform {
    transform(value: string | Date): string {
        if (!value) return 'Last active - N/A';

        const now = new Date();
        const date = new Date(value);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 0) return 'Last active - 🟢 just now';

        if (seconds / 60 < 15) return 'Active 🟢';

        const intervals: { [key: string]: number } = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (const key of Object.keys(intervals)) {
            const interval = Math.floor(seconds / intervals[key]);
            if (interval >= 1) {
                return `Last active - ${interval} ${key}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    }
}
