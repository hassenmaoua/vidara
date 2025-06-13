import { Component, Input } from '@angular/core';
import { AccessLevel, ContentDTO, ContentType } from '../../../models';
import { ContentService } from '../../../services/content.service';
import { ContentComponent } from '../content-card/content-card.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-content-list',
    imports: [CommonModule, ContentComponent],
    templateUrl: './content-list.component.html',
    styleUrl: './content-list.component.scss'
})
export class ContentListComponent {
    @Input() followedCreatorIds: number[] = [0, 1, 2, 3];
    @Input() contentType: ContentType | undefined;
    @Input() accessLevel: AccessLevel | undefined;

    @Input() size: number = 10;
    page: number = 0;
    lastPage: boolean = false;
    contents: ContentDTO[] = [];
    isLoading: boolean = false;

    private readonly scrollListener = () => this.onWindowScroll();

    constructor(private readonly contentService: ContentService) {}

    ngOnInit(): void {
        this.loadContent();
        window.addEventListener('scroll', this.scrollListener);
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.scrollListener);
    }

    loadContent(): void {
        if (this.isLoading || this.lastPage) return;

        this.isLoading = true;

        this.contentService.loadContent(this.followedCreatorIds, this.contentType, this.accessLevel, this.page, this.size).subscribe({
            next: (response) => {
                this.contents = [...this.contents, ...response.content];
                this.lastPage = response.last;
                this.page++;
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Failed to load content:', error);
                this.isLoading = false;
            }
        });
    }

    onWindowScroll(): void {
        const threshold = 200; // px from bottom
        const position = window.innerHeight + window.scrollY;
        const height = document.body.offsetHeight;

        if (height - position < threshold) {
            this.loadContent();
        }
    }
}
