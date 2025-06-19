import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
import { ContentDTO } from '../../../models';
import { StorageUrlPipe } from '../../../pipes/storage-url.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MenuItem, MessageService } from 'primeng/api';
import { ContentModalComponent } from '../content-modal/content-modal.component';
import { ContentService } from '../../../services/content.service';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-content',
    imports: [FormsModule, RouterModule, PanelModule, AvatarModule, ButtonModule, MenuModule, ImageModule, GalleriaModule, SafeUrlPipe, StorageUrlPipe, FormatDatePipe, SkeletonModule, ContentModalComponent, ToastModule],
    templateUrl: './content-card.component.html',
    styleUrl: './content-card.component.scss'
})
export class ContentComponent implements OnInit {
    @Input() content!: ContentDTO;

    @Output() contentUpdated = new EventEmitter<ContentDTO>();
    @Output() contentRemoved = new EventEmitter<number>();

    items: MenuItem[] = [];
    showFullDescription: boolean = false;

    modalVisible = false;
    contentToEdit: ContentDTO | null = null;

    constructor(
        private readonly sanitizer: DomSanitizer,
        private readonly authService: AuthService,
        private readonly contentService: ContentService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Edit',
                icon: 'pi pi-pen-to-square',
                command: () => this.openEditModal()
            },
            {
                label: this.content.active ? 'Unpublishe' : 'Publish',
                icon: this.content.active ? 'pi pi-minus-circle' : 'pi pi-share-alt',
                command: () => this.togglePublish()
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                styleClass: 'text-red-500',
                id: String(this.content.id),
                command: () => this.deleteContent()
            }
        ];
    }

    toggleDescription(): void {
        this.showFullDescription = !this.showFullDescription;
    }

    get displayDescription(): SafeHtml {
        let html = this.content?.description || '';

        // Replace non-breaking spaces with regular spaces to allow word wrapping
        html = html.replace(/&nbsp;/g, ' ');

        if (this.showFullDescription || html.length <= 200) {
            return this.sanitizer.bypassSecurityTrustHtml(`<p>${html}</p>`);
        }

        // Safely extract and truncate visible text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.innerText;
        const truncatedText = text.slice(0, 200) + '...';

        return this.sanitizer.bypassSecurityTrustHtml(`<p>${truncatedText}</p>`);
    }

    get hasImages(): boolean {
        return this.content.contentType == 'IMAGE' && !!this.content.storageUrl;
    }

    get hasVideo(): boolean {
        return this.content.contentType == 'VIDEO' && !!this.content.storageUrl;
    }

    get isPayPerView(): boolean {
        return this.content?.accessLevel === 'PAY_PER_VIEW';
    }

    get isAuthor(): boolean {
        return this.authService.currentUser?.id === this.content.creatorId;
    }

    openEditModal() {
        this.contentToEdit = this.content;
        this.modalVisible = true;
    }

    onContentUpdated(event: ContentDTO) {
        // Refresh logic here (fetch latest content or emit event to parent)
        this.contentUpdated.emit(event);
    }

    togglePublish(): void {
        const observer$ = this.content.active ? this.contentService.unpublishContent(this.content.id) : this.contentService.publishContent(this.content.id);

        observer$.subscribe({
            next: (event) => {
                this.messageService.clear('publish');
                this.messageService.add({
                    key: 'publish',
                    severity: 'success',
                    summary: 'Content is ' + this.content.active ? 'unpublished!' : 'published!'
                });
                setTimeout(() => {
                    this.contentUpdated.emit(event.body);
                }, 200);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Operation failed',
                    detail: err.message
                });
            }
        });
    }

    deleteContent() {
        this.contentService.deleteContent(this.content.id).subscribe({
            next: (event) => {
                setTimeout(() => {
                    this.contentRemoved.emit(this.content.id);
                }, 200);
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Operation failed',
                    detail: err.message
                });
            }
        });
    }
}
