import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
import { StorageUrlPipe } from '../../../pipes/storage-url.pipe';
import { AuthService } from '../../auth/auth.service';
import { ContentDTO } from '../../../models';
import { UserDTO } from '../../../models/userDTO.model';
import { HttpEventType } from '@angular/common/http';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';
@Component({
    selector: 'app-content-modal',
    standalone: true,
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
        StorageUrlPipe,
        SafeUrlPipe
    ],
    templateUrl: './content-modal.component.html',
    styleUrl: './content-modal.component.scss'
})
export class ContentModalComponent implements OnInit {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() content: ContentDTO | null = null;
    @Output() contentSubmitted = new EventEmitter<ContentDTO>();

    @ViewChild('fu') fileUploader!: FileUpload;

    user: UserDTO | undefined;

    text: string = '';
    title: string = '';
    price: number | null = null;
    accessLevel: 'PUBLIC' | 'SUBSCRIBER_ONLY' | 'PAY_PER_VIEW' = 'SUBSCRIBER_ONLY';
    uploadedFile: File | null = null;
    selectOptions = [
        { name: 'Public', value: 'PUBLIC', icon: 'pi pi-globe' },
        { name: 'Subscriber Only', value: 'SUBSCRIBER_ONLY', icon: 'pi pi-lock' },
        { name: 'Pay Per View', value: 'PAY_PER_VIEW', icon: 'pi pi-dollar' }
    ];

    constructor(
        private readonly messageService: MessageService,
        private readonly contentService: ContentService,
        private readonly authService: AuthService
    ) {}

    ngOnInit(): void {
        this.user = this.authService.currentUser;
    }

    populateForm(content: ContentDTO): void {
        this.title = content.title ?? '';
        this.text = content.description ?? '';
        this.accessLevel = content.accessLevel ?? 'SUBSCRIBER_ONLY';
        this.price = content.price ?? null;
    }

    submit(): void {
        const formData = new FormData();
        formData.append('accessLevel', this.accessLevel);
        if (this.title) formData.append('title', this.title);
        if (this.text) formData.append('description', this.text);
        if (this.price !== null) formData.append('price', String(this.price));
        if (this.uploadedFile) formData.append('file', this.uploadedFile);

        const isUpdate = !!this.content?.id;
        const toastKey = 'upload-toast';

        const observable = isUpdate ? this.contentService.updateContent(this.content!.id, formData) : this.contentService.createContent(formData);

        observable.subscribe({
            next: (event) => {
                if (event.type === HttpEventType.UploadProgress && event.total) {
                    const progress = Math.round((100 * event.loaded) / event.total);
                    this.messageService.clear(toastKey);
                    this.messageService.add({
                        key: toastKey,
                        severity: 'info',
                        summary: `Uploading... ${progress}%`,
                        closable: false,
                        life: 30000
                    });
                }

                if (event.type === HttpEventType.Response) {
                    this.messageService.clear(toastKey);
                    this.messageService.add({
                        severity: 'success',
                        summary: isUpdate ? 'Post updated!' : 'Post created!',
                        detail: ''
                    });
                    this.resetForm();
                    this.visibleChange.emit(false);
                    this.contentSubmitted.emit(event.body);
                }
            },
            error: (err) => {
                this.messageService.clear(toastKey);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Operation failed',
                    detail: err.message
                });
            }
        });
    }

    onFileSelect(event: any): void {
        this.uploadedFile = event.files[0] ?? null;
    }

    resetForm(): void {
        this.title = '';
        this.text = '';
        this.price = null;
        this.uploadedFile = null;
        this.fileUploader?.clear?.();
    }

    handleHide() {
        this.resetForm();
        this.visibleChange.emit(false); // tells parent the modal has been closed
    }

    handleShow() {
        if (this.content) {
            this.populateForm(this.content);
        }

        this.setupCustomImageHandler();
    }

    setupCustomImageHandler() {
        const customImageBtn = document.querySelector('.ql-my-image');
        if (customImageBtn && this.fileUploader) {
            customImageBtn.addEventListener('click', () => {
                this.fileUploader.advancedFileInput.nativeElement.click();
            });
        }
    }

    get isUpdateMode(): boolean {
        return !!this.content;
    }

    get hasImages(): boolean {
        return this.content?.contentType == 'IMAGE' && !!this.content.storageUrl;
    }

    get hasVideo(): boolean {
        return this.content?.contentType == 'VIDEO' && !!this.content.storageUrl;
    }

    get contentForUpdate(): ContentDTO {
        return (
            this.content || {
                id: 0,
                creatorId: 0,
                storageUrl: '',
                thumbnailUrl: '',
                contentType: 'IMAGE',
                accessLevel: 'PUBLIC',
                price: 0,
                title: '',
                description: '',
                active: false,
                createdAt: '',
                updatedAt: ''
            }
        );
    }
}
