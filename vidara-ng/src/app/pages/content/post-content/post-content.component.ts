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

@Component({
    selector: 'app-post-content',
    imports: [FormsModule, AvatarModule, ButtonModule, Dialog, InputTextModule, FileUpload, EditorModule, ToastModule, FluidModule],
    templateUrl: './post-content.component.html',
    styleUrl: './post-content.component.scss',
    providers: [MessageService]
})
export class PostContentComponent {
    @ViewChild('fu') fileUploader!: FileUpload;

    text: string | undefined;
    visible: boolean = false;
    uploadedFiles: any[] = [];

    constructor(private readonly messageService: MessageService) {}

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

    onUpload(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    }
}
