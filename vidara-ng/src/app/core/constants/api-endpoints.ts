export const authWS = {
    login: '/auth-service/auth/login',
    register: '/auth-service/auth/register',
    verifyToken: '/auth-service/auth/verify_token',
    getByUsername: '/auth-service/users/{username}',
    emailExists: '/auth-service/users/email-exists',
    usernameExists: '/auth-service/users/username-exists'
};

export const contentWS = {
    loadContent: '/content-service/contents',
    createContentWithFile: '/content-service/contents',
    STORAGE_URL: '/content-service/content/files/{0}'
};
