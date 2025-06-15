export interface UserDTO {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar: string;
    cover: string;
    bio: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    country: string;
    language: string;
    age: number;
    phone: string;
    roles: string[];
    enabled: boolean;
    accountLocked: boolean;
    lastLogin: string;
}
