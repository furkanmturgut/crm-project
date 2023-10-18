import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import {prime} from "@/components/Base/prime";
const app = createApp(App);
app.use(router);
prime(app);

app.mount("#app");
export default app;
