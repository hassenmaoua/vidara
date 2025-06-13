import { UserDTO } from './userDTO.model';

export type ContentType = 'IMAGE' | 'VIDEO' | 'TEXT' | 'UNKNOWN';

export type AccessLevel = 'PUBLIC' | 'SUBSCRIBER_ONLY' | 'PAY_PER_VIEW';

export interface ContentDTO {
    id: number;
    creatorId: number;
    storageUrl: string;
    thumbnailUrl: string;
    contentType: ContentType;
    accessLevel: AccessLevel;
    price: number;
    title: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;

    creator?: UserDTO;
}
