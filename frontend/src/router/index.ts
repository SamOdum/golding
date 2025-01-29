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

  // Perform initial auth check only once
  if (!authInitialized) {
    await authStore.checkAuth();
    authInitialized = true;
  }

  // Wait for loading to complete
  if (authStore.loading) {
    // You might want to show a loading spinner here
    return;
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
