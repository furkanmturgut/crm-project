import { createRouter,createWebHistory } from "vue-router";
import HomeView from '@/views/HomeView.vue';
import CustomerView from '@/views/customers/CustomerView.vue';

const routes = [
{path:"/home",component:HomeView,name:"HomeView"},    
{path:"/",component:()=>import("@/views/LoginView.vue")},
{path:"/customers",name:"CustomerView",component:CustomerView,props:true},


]

const router = createRouter({
    history:createWebHistory(),
    routes
});



export default router;