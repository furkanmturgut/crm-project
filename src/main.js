import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import PrimeVue from "primevue/config";
import 'primeicons/primeicons.css';
import ConfirmationService from 'primevue/confirmationservice';

import "primevue/resources/themes/lara-light-indigo/theme.css";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import PanelMenu from 'primevue/panelmenu';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DynamicDialog from 'primevue/dynamicdialog';
import DialogService from 'primevue/dialogservice';
import Textarea from 'primevue/textarea';
import InputMask from 'primevue/inputmask';
import RadioButton from 'primevue/radiobutton';
import FileUpload from 'primevue/fileupload';
import AutoComplete from 'primevue/autocomplete';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Knob from 'primevue/knob';
    
const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(router);
app.use(ConfirmationService);
app.use(DialogService);

app.component("TInputText", InputText);
app.component("TButton", Button);
app.component("TSpinner", ProgressSpinner);
app.component("TToast", Toast);
app.component("TPanelMenu",PanelMenu);
app.component("TConfirmDialog",ConfirmDialog);
app.component("TDataTable",DataTable);
app.component("TColumn",Column);
app.component("TDynamicDialog",DynamicDialog);
app.component("TextArea",Textarea);
app.component("TInputMaskView",InputMask);
app.component("TRadioButton",RadioButton);
app.component("TFileUpload",FileUpload);
app.component("TAutoComplete",AutoComplete);
app.component("TAccordion",Accordion);
app.component("TAccordionTab",AccordionTab);
app.component("TKnob",Knob);


app.mount("#app");
