import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import PrimeVue from "primevue/config";
import 'primeicons/primeicons.css';

import "primevue/resources/themes/lara-light-indigo/theme.css";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import PanelMenu from 'primevue/panelmenu';

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(router);

app.component("TInputText", InputText);
app.component("TButton", Button);
app.component("TSpinner", ProgressSpinner);
app.component("TToast", Toast);
app.component("TPanelMenu",PanelMenu);
app.mount("#app");
