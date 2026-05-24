import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "webputty_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function isAdmin(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        const payload: any = jwtDecode(token);
        return payload.role === "admin";
    } catch {
        return false;
    }
}