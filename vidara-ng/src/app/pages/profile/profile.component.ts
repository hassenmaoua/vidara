import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/userDTO.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { StorageUrlPipe } from '../../pipes/storage-url.pipe';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ContentListComponent } from '../content/content-list/content-list.component';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, RouterModule, SkeletonModule, StorageUrlPipe, AvatarModule, ButtonModule, ContentListComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    user: UserDTO | null = null;
    loading = true;
    username: string = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.username = params['username'];
            if (this.username) {
                this.fetchUser(this.username);
            }
        });
    }

    fetchUser(username: string): void {
        this.loading = true;
        this.authService.getUserByUsername(username).subscribe({
            next: (user: UserDTO) => {
                this.user = user;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.router.navigate(['/notfound']);
            }
        });
    }

    get safeCover() {
        return this.user?.cover ? this.sanitizer.bypassSecurityTrustUrl(this.user.cover) : null;
    }
}
