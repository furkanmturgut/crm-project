import app from "@/main.js";

export const toastError = (desc) => {
    const toast = app.config.globalProperties.$toast;
    toast.add({severity:"error",life:1000,summary:"Hata",detail:desc});
}

export const toastSuccess = (desc) => {
    const toast = app.config.globalProperties.$toast;
    toast.add({severity:"success",life:1000,detail:desc,summary:"Başarılı"});
}