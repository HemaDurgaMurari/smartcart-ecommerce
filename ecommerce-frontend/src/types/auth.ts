export type Role = "ADMIN" | "USER";

export interface SignupRequest {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface SigninRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    userId: number;
    name: string;
    email: string;
    role: Role;
    message: string;
    token: string;
}