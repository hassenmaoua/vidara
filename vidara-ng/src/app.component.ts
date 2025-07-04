import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    providers: [MessageService],
    template: ` <p-toast position="top-right"></p-toast>
        <router-outlet></router-outlet>`
})
export class AppComponent {}
