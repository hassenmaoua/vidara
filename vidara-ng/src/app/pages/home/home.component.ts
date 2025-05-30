import { Component } from '@angular/core';

import { PostContentComponent } from '../content/post-content/post-content.component';
import { ContentComponent } from '../content/content-card/content-card.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    imports: [PostContentComponent, ContentComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    contents = [
        {
            author: {
                name: 'Empty Image User',
                email: 'noimage@example.com'
            },
            description: `This one doesn't have any image.`,
            images: [],
            videoUrl:
                'https://rr1---sn-a5msenll.googlevideo.com/videoplayback?expire=1747537270&ei=FvkoaIfWLLqAkucPzNzluQs&ip=2a13%3A55c0%3Ae98c%3A1a74%3Ac5dc%3Acedf%3Ae15d%3Ab425&id=o-ACZ3aPscbLm_e-k9t87aBgf-ZyWXxr5obZZnUo6-uRu_&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&bui=AecWEAbHeUm_sRisabu7MxuPQEH8KsfyAdphUv-SAc8l2lYrvxhpl-I7fO2BnN5CQi-bHVK0hr_fwfvU&vprv=1&svpuc=1&mime=video%2Fmp4&ns=Yi7D2CcbyWC_vB_7Kk3ib08Q&rqh=1&gir=yes&clen=5295378&ratebypass=yes&dur=69.589&lmt=1747511885088145&lmw=1&c=TVHTML5&sefc=1&txp=5430534&n=9pXN65q1FHaI0A&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRAIgTxoHOGPhbstDtcWYt7JJJIBDc6esjzROoao8MwAlTPQCIHmuxIaxorQchUI9Kg2_RmUWj0lkzab5zNmSxVombony&title=AC%20Unity%20Long%20Parkour%20Short&redirect_counter=1&cm2rm=sn-o09lr7l&rrc=80&fexp=24350590,24350737,24350827,24350961,24351173,24351177,24351495,24351528,24351594,24351638,24351658,24351661,24351757,24351789,24351864,24351865,24351907,24351984,24352018,24352021,24352023,24352031&req_id=fa05b96d82f2a3ee&cms_redirect=yes&cmsv=e&met=1747515680,&mh=kB&mip=197.10.164.182&mm=34&mn=sn-a5msenll&ms=ltu&mt=1747515401&mv=u&mvi=1&pl=11&rms=ltu,au&lsparams=met,mh,mip,mm,mn,ms,mv,mvi,pl,rms&lsig=ACuhMU0wRQIgea_OP3Aia6zabinbLxDy2_ygSGuFiPRcipSVzbNYpI0CIQD7qJ4zFEz3rXbc01fFSQYYuVSiPJ5oFQXgwTqTcDVV_w%3D%3D',
            updatedAt: '1 day ago'
        },
        {
            author: {
                name: 'Amy Elsner',
                email: 'amyelsneremail.com',
                avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'
            },
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam..`,
            images: ['https://primefaces.org/cdn/primeng/images/galleria/galleria11.jpg'],
            updatedAt: '2 hours ago'
        },
        {
            author: {
                name: 'John Doe',
                email: 'john@example.com',
                avatar: 'https://primefaces.org/cdn/primevue/images/avatar/johndoe.png'
            },
            description: `Another example post with multiple images for demo purposes.`,
            images: ['https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg', 'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg'],
            updatedAt: '5 hours ago'
        }
    ];
}
