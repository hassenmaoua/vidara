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
    getContentByCreator: '/api-gateway/contents/creator/{0}',
    unpublishContent: '/api-gateway/contents/{0}/unpublish',
    publishContent: '/api-gateway/contents/{0}/publish',
    createContent: '/api-gateway/contents',
    updateContent: '/api-gateway/contents/{0}',
    deleteContent: '/api-gateway/contents/{0}',
    STORAGE_URL: '/api-gateway/public/files/{0}'
};
