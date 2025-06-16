import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { StorageUrlPipe } from '../../../pipes/storage-url.pipe';
import { AuthService } from '../../auth/auth.service';
import { UserDTO } from '../../../models/userDTO.model';
import { ContentModalComponent } from '../content-modal/content-modal.component';
import { ContentDTO } from '../../../models';

@Component({
    selector: 'app-post-content',
    imports: [
        CommonModule,
        FormsModule,
        AvatarModule,
        ButtonModule,
        InputTextModule,
        EditorModule,
        ToastModule,
        FluidModule,
        FloatLabelModule,
        SelectModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        StorageUrlPipe,
        ContentModalComponent
    ],
    templateUrl: './post-content.component.html',
    styleUrl: './post-content.component.scss'
})
export class PostContentComponent {
    user: UserDTO | undefined;
    visible: boolean = false;

    constructor(private readonly authService: AuthService) {}

    ngOnInit() {
        this.user = this.authService.currentUser;
    }

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.visible = false;
    }
}
