export class User {
    email: string;
    login: string;
    username: string;
    password: string;
    confirmPassword: string;
    createdBy: string;
    activated: boolean;
    rememberMe: boolean;
    authorities?: any[];
}
