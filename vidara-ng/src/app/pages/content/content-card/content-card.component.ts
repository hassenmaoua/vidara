import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { PhotoService } from '../../service/photo.service';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
import { ContentDTO } from '../../../models';
import { StorageUrlPipe } from '../../../pipes/storage-url.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-content',
    imports: [FormsModule, RouterModule, PanelModule, AvatarModule, ButtonModule, MenuModule, ImageModule, GalleriaModule, SafeUrlPipe, StorageUrlPipe, FormatDatePipe, SkeletonModule],
    templateUrl: './content-card.component.html',
    styleUrl: './content-card.component.scss',
    providers: [PhotoService]
})
export class ContentComponent implements OnInit {
    @Input() content!: ContentDTO;

    showFullDescription: boolean = false;

    items: { label?: string; icon?: string; separator?: boolean }[] = [];
    images: any[] = [];

    constructor(
        private readonly photoService: PhotoService,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit() {
        this.photoService.getImages().then((images) => {
            this.images = images;
        });

        this.items = [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
            {
                separator: true
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
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

    // get isSingleImage(): boolean {
    //     return this.content.images.length === 1;
    // }

    // get isMultipleImages(): boolean {
    //     return this.content.images.length > 1;
    // }

    // get galleriaImages(): any[] {
    //     return this.content.images.map((img: string) => ({
    //         itemImageSrc: img,
    //         thumbnailImageSrc: img,
    //         alt: 'Post image'
    //     }));
    // }

    // galleriaResponsiveOptions: any[] = [
    //     {
    //         breakpoint: '1024px',
    //         numVisible: 5
    //     },
    //     {
    //         breakpoint: '960px',
    //         numVisible: 4
    //     },
    //     {
    //         breakpoint: '768px',
    //         numVisible: 3
    //     },
    //     {
    //         breakpoint: '560px',
    //         numVisible: 1
    //     }
    // ];
}
