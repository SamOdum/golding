import { defineStore } from "pinia";
import api from "../lib/axios";
import type {
  AuthState,
  LoginCredentials,
  SignupCredentials,
  User,
} from "../types/auth";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  }),

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/api/login", credentials);
        const user: User = response.data.user;
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Login failed";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async signup(credentials: SignupCredentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/api/register", credentials);
        const user: User = response.data.user;
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Signup failed";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post("/api/logout");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    async checkAuth() {
      this.loading = true;
      try {
        const response = await api.get("/api/protected");
        const user: User = response.data.user;
        this.user = user;
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
