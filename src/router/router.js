import { createRouter,createWebHistory } from "vue-router";
import HomeView from '@/views/HomeView.vue';
import CustomerView from '@/views/customers/CustomerView.vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const routes = [
{path:"/home",component:HomeView,name:"HomeView"},    
{path:"/",component:()=>import("@/views/LoginView.vue"),name:"LoginView"},
{path:"/customers",name:"CustomerView",component:CustomerView,props:true,meta:{requiresAuth:true}},


]

const router = createRouter({
    history:createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const auth = getAuth();
  
    onAuthStateChanged(auth, async (user) => {
  
      if (requiresAuth && !user) {
        next("/");
      } else if (requiresAuth == false && user) {
        next("/home");
      } else {
        next();
      }
    });
  });



export default router;