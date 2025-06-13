import { Component } from '@angular/core';

import { PostContentComponent } from '../content/post-content/post-content.component';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ContentListComponent } from '../content/content-list/content-list.component';

@Component({
    selector: 'app-home',
    imports: [PostContentComponent, ContentListComponent, CommonModule, PanelModule, SkeletonModule, ButtonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    constructor() {}
}
