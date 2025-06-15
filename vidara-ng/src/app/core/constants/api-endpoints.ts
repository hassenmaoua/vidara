export const authWS = {
    login: '/api-gateway/auth/login',
    register: '/api-gateway/auth/register',
    verifyToken: '/api-gateway/auth/verify_token',
    emailExists: '/api-gateway/auth/email-exists',
    usernameExists: '/api-gateway/auth/username-exists',
    getByUsername: '/api-gateway/users/{username}',
    updateProfile: '/api-gateway/users/update-profile',
    changePassword: '/api-gateway/users/change-password'
};

export const contentWS = {
    loadContent: '/api-gateway/contents',
    createContentWithFile: '/api-gateway/contents',
    STORAGE_URL: '/api-gateway/public/files/{0}'
};
