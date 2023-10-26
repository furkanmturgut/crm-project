import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import {prime} from "@/components/Base/prime";
import JsonExcel from "vue-json-excel3";
const app = createApp(App);
app.use(router);
prime(app);
app.component("downloadExcel", JsonExcel);


app.mount("#app");
export default app;
