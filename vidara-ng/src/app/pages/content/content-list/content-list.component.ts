import { Component, Input } from '@angular/core';
import { AccessLevel, ContentDTO, ContentType } from '../../../models';
import { ContentService } from '../../../services/content.service';
import { ContentComponent } from '../content-card/content-card.component';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-content-list',
    imports: [CommonModule, ContentComponent, ToastModule],
    templateUrl: './content-list.component.html',
    styleUrl: './content-list.component.scss'
})
export class ContentListComponent {
    @Input() followedCreatorIds: number[] = [0, 1, 2, 3];
    @Input() creatorId: number | undefined;
    @Input() contentType: ContentType | undefined;
    @Input() accessLevel: AccessLevel | undefined;

    @Input() size: number = 10;
    page: number = 0;
    lastPage: boolean = false;
    contents: ContentDTO[] = [];
    isLoading: boolean = false;

    private readonly scrollListener = () => this.onWindowScroll();

    constructor(
        private readonly contentService: ContentService,
        private readonly messageService: MessageService
    ) {}

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

        const request$ = this.creatorId
            ? this.contentService.getContentByCreator(this.creatorId, this.contentType, this.accessLevel, this.page, this.size)
            : this.contentService.loadContent(this.followedCreatorIds, this.contentType, this.accessLevel, this.page, this.size);

        request$.subscribe({
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

    onContentUpdated(updatedContent: ContentDTO) {
        const index = this.contents.findIndex((c) => c.id === updatedContent.id);
        if (index !== -1) {
            // Preserve the existing creator
            const existingContent = this.contents[index];

            // Merge updated fields while keeping the existing creator
            const mergedContent = {
                ...existingContent, // keep old content (e.g., creator)
                ...updatedContent, // overwrite with updated fields
                creator: existingContent.creator // enforce creator if overwritten
            };

            this.contents[index] = mergedContent;
            this.contents = [...this.contents]; // trigger change detection
        }
    }

    onContentRemoved(contentId: number): void {
        const index = this.contents.findIndex((c) => c.id === contentId);

        if (index !== -1) {
            // Remove the item at the found index
            this.contents.splice(index, 1);

            // Trigger change detection by reassigning the array
            this.contents = [...this.contents];

            this.messageService.add({
                severity: 'success',
                summary: 'Post deleted!',
                detail: ''
            });
        }
    }
}
