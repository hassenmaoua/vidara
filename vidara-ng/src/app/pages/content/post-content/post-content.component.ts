import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FileUpload } from 'primeng/fileupload';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ContentService } from '../../../services/content.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { StorageUrlPipe } from '../../../pipes/storage-url.pipe';
import { AuthService } from '../../auth/auth.service';
import { UserDTO } from '../../../models/userDTO.model';

@Component({
    selector: 'app-post-content',
    imports: [
        CommonModule,
        FormsModule,
        AvatarModule,
        ButtonModule,
        Dialog,
        InputTextModule,
        FileUpload,
        EditorModule,
        ToastModule,
        FluidModule,
        FloatLabelModule,
        SelectModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        StorageUrlPipe
    ],
    templateUrl: './post-content.component.html',
    styleUrl: './post-content.component.scss',
    providers: [MessageService]
})
export class PostContentComponent {
    @ViewChild('fu') fileUploader!: FileUpload;

    user: UserDTO | undefined;

    text: string = '';
    visible: boolean = false;
    uploadedFile: File | null = null;
    accessLevel: 'PUBLIC' | 'SUBSCRIBER_ONLY' | 'PAY_PER_VIEW' = 'SUBSCRIBER_ONLY';
    selectOptions: any[] = [
        { name: 'Public', value: 'PUBLIC', icon: 'pi-trophy' },
        { name: 'Subscriber Only', value: 'SUBSCRIBER_ONLY', icon: 'pi-crown' },
        { name: 'Pay Per View', value: 'PAY_PER_VIEW', icon: 'pi-money-bill' }
    ];
    title: string = '';
    price: number | null = null;
    uploadedFiles: any[] = [];

    constructor(
        private readonly messageService: MessageService,
        private readonly contentService: ContentService,
        private readonly authService: AuthService
    ) {}

    onFileSelect(event: any) {
        this.uploadedFile = event.files[0] ?? null;
    }

    ngOnInit() {
        this.user = this.authService.currentUser;
    }

    submitContent() {
        const formData = new FormData();
        formData.append('accessLevel', this.accessLevel);
        if (this.title) formData.append('title', this.title);
        if (this.text) formData.append('description', this.text);
        if (this.price !== null) formData.append('price', String(this.price));
        if (this.uploadedFile) formData.append('file', this.uploadedFile);

        let toastKey = 'upload-toast';

        this.contentService.createContent(formData).subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    const progress = Math.round(100 * (event.loaded / event.total));
                    this.messageService.clear(toastKey);
                    this.messageService.add({
                        key: toastKey,
                        severity: 'info',
                        summary: `Uploading... ${progress}%`,
                        detail: '',
                        closable: false,
                        life: 30000 // keep alive long enough
                    });
                }

                if (event.type === HttpEventType.Response) {
                    this.messageService.clear(toastKey);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Post created successfully!',
                        detail: ''
                    });
                    this.visible = false;
                    this.resetForm();
                }
            },
            error: (err) => {
                this.messageService.clear(toastKey);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Failed to create post',
                    detail: err.message
                });
            }
        });
    }

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }

    private resetForm() {
        this.text = '';
        this.title = '';
        this.price = null;
        this.uploadedFile = null;
        this.fileUploader.clear();
    }

    showDialog() {
        this.visible = true;
        setTimeout(() => {
            const customImageBtn = document.querySelector('.ql-my-image');
            if (customImageBtn && this.fileUploader) {
                customImageBtn.addEventListener('click', () => {
                    this.fileUploader.advancedFileInput.nativeElement.click();
                });
            }
        });
    }
}
