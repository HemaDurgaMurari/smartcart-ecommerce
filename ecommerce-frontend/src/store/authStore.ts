import { create } from "zustand";
import type { AuthResponse } from "../types/auth";

interface AuthState {
    user: AuthResponse | null;
    login: (user: AuthResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),

    login: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token);
        set({ user });
    },

    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null });
    },
}));