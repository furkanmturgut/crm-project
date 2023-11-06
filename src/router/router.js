import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CustomerView from "@/views/customers/CustomerView.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ProjectView from "@/views/project/ProjectView.vue";
import InterviewNotes from "@/views/notes/InterviewNotes.vue";
const routes = [
  {
    path: "/home",
    component: HomeView,
    name: "HomeView",
    meta: { requiresAuth: true, title: "Anasayfa - CRM" },
  },
  {
    path: "/",
    component: () => import("@/views/LoginView.vue"),
    name: "LoginView",
    meta: { title: "Giriş Yap" },
  },
  {
    path: "/customers",
    name: "CustomerView",
    component: CustomerView,
    props: true,
    meta: { requiresAuth: true, title: "Müşteri Yönetimi" },
  },
  {
    path: "/project",
    name: "ProjectView",
    component: ProjectView,
    props: true,
    meta: { requiresAuth: true, title: "Projeler" },
  },
  {
    path: "/notes",
    name: "OffersView",
    component: InterviewNotes,
    props: true,
    meta: { requiresAuth: true, title: "Görüşme Notları" },
  },
  {
    path: "/request",
    name: "CreateRequestView",
    component: () => import("@/views/request/CreateRequest.vue"),
    props: true,
    meta: { requiresAuth: true, title: "Taleplerim" },
  },
  {
    path: "/adminRequest",
    name: "AdminRequest",
    component: () => import("@/views/request/admin/AdminRequest.vue"),
    props: true,
    meta: { requiresAuth: true, title: "Müşteri Talepleri" },
  },

  {
    path: "/reply",
    name: "ReplyView",
    component: () => import("@/views/reply/ReplyView.vue"),
    props: true,
    meta: { requiresAuth: true, title: "Talep Yanıtları" },
  },
  {
    path: "/chat",
    name: "ChatView",
    component: () => import("@/views/chat/ChatView.vue"),
    props: true,
    meta: { requiresAuth: true, title: "Mesajlar" },
    children:[{
      path:':id'
    }]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  document.title = to.meta?.title ?? "CRM Turkuvaz";

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (
      (to.path === "/request" && (!user || user.displayName === null)) ||
      (to.path == "/adminRequest" && (!user || user.displayName !== null)) ||
      (to.path == "/customers" && (!user || user.displayName !== null)) ||
      (to.path == "/notes" && (!user || user.displayName !== null)) ||
      (to.path == "/reply" && (!user || user.displayName !== null))
    ) {
      next("/");
    } else {
      if (requiresAuth && !user) {
        next("/");
      } else if (requiresAuth === false && user) {
        next("/home");
      } else {
        next();
      }
    }
  });
});
export default router;
