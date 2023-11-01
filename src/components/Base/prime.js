import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from 'primevue/tooltip';

import "primevue/resources/themes/lara-light-indigo/theme.css";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import PanelMenu from "primevue/panelmenu";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DialogService from "primevue/dialogservice";
import Textarea from "primevue/textarea";
import InputMask from "primevue/inputmask";
import RadioButton from "primevue/radiobutton";
import FileUpload from "primevue/fileupload";
import AutoComplete from "primevue/autocomplete";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import Knob from "primevue/knob";
import Tag from 'primevue/tag';
import ContextMenu from 'primevue/contextmenu';
import Dropdown from 'primevue/dropdown';
import Menu from 'primevue/menu';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';


export const prime = (app) => {
  app.use(PrimeVue);
  const toastService = app.use(ToastService);
  const confirmationService = app.use(ConfirmationService);
  const dialogService = app.use(DialogService);

  app.directive('tooltip', Tooltip);

  app.component("TInputText", InputText);
  app.component("TButton", Button);
  app.component("TSpinner", ProgressSpinner);
  app.component("TToast", Toast);
  app.component("TPanelMenu", PanelMenu);
  app.component("TDataTable", DataTable);
  app.component("TColumn", Column);
  app.component("TextArea", Textarea);
  app.component("TConfirm",ConfirmDialog);
  app.component("TInputMaskView", InputMask);
  app.component("TRadioButton", RadioButton);
  app.component("TFileUpload", FileUpload);
  app.component("TAutoComplete", AutoComplete);
  app.component("TAccordion", Accordion);
  app.component("TAccordionTab", AccordionTab);
  app.component("TKnob", Knob);
  app.component("TTag",Tag);
  app.component("TContextMenu",ContextMenu);
  app.component("TDropdown",Dropdown);
  app.component("TMenu" ,Menu);
  app.component("TDialog", Dialog);

  app.config.globalProperties.$toast =
    toastService.config.globalProperties.$toast;
  app.config.globalProperties.$confirm =
    confirmationService.config.globalProperties.$confirm;
  app.config.globalProperties.$dialog =
    dialogService.config.globalProperties.$dialog;
};
