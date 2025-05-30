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

@Component({
    selector: 'app-content',
    imports: [FormsModule, PanelModule, AvatarModule, ButtonModule, MenuModule, ImageModule, GalleriaModule, SafeUrlPipe],
    templateUrl: './content-card.component.html',
    styleUrl: './content-card.component.scss',
    providers: [PhotoService]
})
export class ContentComponent implements OnInit {
    @Input() content: any;

    showFullDescription: boolean = false;

    items: { label?: string; icon?: string; separator?: boolean }[] = [];
    images: any[] = [];

    constructor(private readonly photoService: PhotoService) {}

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

    get displayDescription(): string {
        if (!this.content?.description) return '';
        if (this.showFullDescription || this.content.description.length <= 200) {
            return this.content.description;
        }
        return this.content.description.slice(0, 200) + '...';
    }

    get hasImages(): boolean {
        return Array.isArray(this.content?.images) && this.content.images.length > 0;
    }

    get isSingleImage(): boolean {
        return this.content.images.length === 1;
    }

    get isMultipleImages(): boolean {
        return this.content.images.length > 1;
    }

    get galleriaImages(): any[] {
        return this.content.images.map((img: string) => ({
            itemImageSrc: img,
            thumbnailImageSrc: img,
            alt: 'Post image'
        }));
    }

    get hasVideo(): boolean {
        return !!this.content?.videoUrl;
    }
    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
}
