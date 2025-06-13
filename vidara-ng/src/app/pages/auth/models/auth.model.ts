export class AuthModel {
    authToken!: string;
    refreshToken!: string;

    setAuth(auth: AuthModel) {
        this.authToken = auth.authToken;
        this.refreshToken = auth.refreshToken;
    }
}
