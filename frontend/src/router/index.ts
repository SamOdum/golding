import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: (_to) => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated ? "/dashboard" : "/login";
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
  ],
});

// Flag to track if initial auth check has been performed
let authInitialized = false;

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Check auth state on page refresh or direct URL access
  if (!authInitialized || to.name === undefined) {
    authStore.loading = true;
    await authStore.checkAuth();
    authInitialized = true;
  }

  // Wait for authentication check to complete
  if (authStore.loading) {
    return; // Hold navigation until loading is complete
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next("/dashboard");
  }
  
  return next();
});

export default router;
