<template>
    <div class="add-area">
        <form @submit.prevent="saveProjectForm">
            <!-- Project Name -->
            <label>Proje Adı</label>
            <TInputText placeholder="Proje Adı Giriniz" v-model="projectName" @input="formValidation(0)"></TInputText>
            <span style="color:red;" v-if="errorState.name">{{ errorMsg.name }}</span>

            <!-- Project Company -->
            <label>Proje Teslim Edilecek Firma</label>
            <TAutoComplete inputStyle="width:100%" v-model="searchCompany" :suggestions="items" optionLabel="name" emptySearchMessage="Firma bulunamadı."
                @complete="search"></TAutoComplete>
            <span style="color:red;" v-if="errorState.company">{{ errorMsg.company }}</span>

            <!-- Project Price -->
            <label>Proje Fiyat</label>
            <TInputText :class="[errorState.currency ? 'p-invalid' : '']" placeholder="Proje Fiyatı TL"
                v-model="projectPrice" type="number" @input="formValidation(1)"></TInputText>
            <span style="color:red;" v-if="errorState.currency">{{ errorMsg.currency }}</span>
            <div style="display: flex; flex-direction: column;"
                v-if="projectPrice != '' && projectPrice.trim().length >= 0">
                <small>Güncel Kur ile USD Fiyatı : <small style="font-weight: bold;"> {{
                    tryToUsd.toString().slice(0, 8) }}</small> </small>
                <small>Güncel Kur ile EURO Fiyatı : <small style="font-weight: bold;"> {{
                    tryToEuro.toString().slice(0, 8) }}</small> </small>
            </div>

            <!-- Project Detail -->
            <label>Proje Açıklama</label>
            <TextArea placeholder="Proje Açıklaması" autoResize rows="5" cols="30" v-model="projectDetail"
                @input="formValidation(2)"></TextArea>
            <div style="width: 100%; margin-top:10px; display: flex; " v-if="detailLength <= 60">
                <TKnob style="margin-right: auto;" :strokeWidth="5" v-model="detailLength" :max="60" :min="0" :size="50"
                    valueColor="blue" textColor="black"></TKnob>
                <span style="color:red; align-items: center; justify-content: center; margin-top: 10px;"
                    v-if="errorState.detail">{{ errorMsg.detail }}</span>
            </div>

            <!-- Project Type -->
            <label>Proje Türü</label>
            <div class="radio-area">
                <TRadioButton v-model="selectProject" value="Scada Web" name="project"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Scada Web</label>

                <TRadioButton v-model="selectProject" value="Masaüstü Yazılım" name="project"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Masaüstü Yazılım</label>

                <TRadioButton v-model="selectProject" value="Mobil Uygulamalar" name="project"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Mobil Uygulamalar</label>

                <TRadioButton v-model="selectProject" value="Fullstack Uygulama Geliştirme" name="project"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Fullstack Uygulama Geliştirme</label>
            </div>
            <span
                style="color:red; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: bold; "
                v-if="errorState.projectType">{{ errorMsg.projectType }}</span>
            <TButton type="submit" label="KAYDET" style="background-color: turquoise; border: 1px solid turquoise;">
            </TButton>

            <span
              style="color:red; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: bold; margin-top: 10px"
              v-if="errorState.all">{{ errorMsg.all }}</span>
            <TToast></TToast>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { computed, ref } from 'vue';
import saveProject from '@/firebase/saveProject.js';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { useRouter } from 'vue-router';
import { toastSuccess } from '@/components/Base/toast';
export default {
    name: "ProjectPopup",
    setup() {
        const selectProject = ref(null);
        const searchCompany = ref(null);
        const customerList = ref([]);
        const router = useRouter();
        const firestore = getFirestore(app);
        const USD = ref(null);
        const EURO = ref(null);
        const projectPrice = ref('');
        const projectName = ref('');
        const projectDetail = ref('');
        const errorState = ref({ currency: false, name: false, detail: false, projectType: false, company: false,all:false });
        const errorMsg = ref({ currency: null, name: null, detail: null, projectType: null, company: null,all:false });
        const items = ref([]);

        // AutoComplete islemi
        const getUserFunc = (async () => {
            const q = query(collection(firestore, "customers"));
            await getDocs(q).then((qSnapshot) => {
                qSnapshot.forEach((item) => {
                    customerList.value.push(item.data());
                })
            })
        });
        getUserFunc();

        const search = () => {
            items.value = [];
            const filteredUser = customerList.value.filter((item) => {
                return item.compName.toLowerCase().includes(searchCompany.value.toLowerCase());
            });

            filteredUser.forEach((item) => {
                items.value.push({
                    name: item.compName
                });
            })
        }

        // Kur ile cevirme islemleri
        const api = "https://finans.truncgil.com/today.json";
        const fetchCurrency = async () => {
            await axios.get(api).then((response) => {
                USD.value = response.data.USD.Alış;
                EURO.value = response.data.EUR.Alış;
            });
        }
        fetchCurrency();

        const tryToUsd = computed(() => {
            return parseFloat(projectPrice.value) / parseFloat(USD.value)
        });

        const tryToEuro = computed(() => {
            return parseFloat(projectPrice.value) / parseFloat(EURO.value);
        });

        const detailLength = computed(() => {
            return projectDetail.value.length;
        });

        // Form kontrolu
        const formValidation = (type) => {
            switch (type) {
                case 0:
                    if (projectName.value.length < 5) {
                        errorState.value.name = true;
                        errorMsg.value.name = "En az 5 karakter ile proje adı tanımlayın.";
                    } else {
                        errorState.value.name = false;
                    }
                    break;
                case 1:
                    if (projectPrice.value <= 0) {
                        errorState.value.currency = true;
                        errorMsg.value.currency = "Lütfen geçerli değer giriniz.";
                        projectPrice.value = 0;
                    } else {
                        errorState.value.currency = false;
                    }
                    break;
                case 2:
                    if (projectDetail.value.length < 60) {
                        errorState.value.detail = true;
                        errorMsg.value.detail = "En az 60 karakter açıklama yazın";
                    } else {
                        errorState.value.detail = false;
                    }
                    break;
            }
        }

        const saveProjectForm = async () => {
            if (projectName.value.length > 5 && projectPrice.value.length > 0 && projectDetail.value.length >= 60) {
                if (selectProject.value != null) {
                    errorState.value.projectType = false;

                    if (searchCompany.value != null) {
                        errorState.value.company = false;
                        const a = JSON.stringify(searchCompany.value.name);
                        const cName = a.replace(/"/g, '');

                        const data = {
                            pName: projectName.value,
                            pPrice: projectPrice.value,
                            pDetail: projectDetail.value,
                            pType: selectProject.value,
                            pCompany: cName,
                        };

                        await saveProject(data);
                        toastSuccess("Proje Başarıyla Eklendi.");

                        setTimeout(() => {
                            router.go({ name: "ProjectView" });
                        }, 1500);
                    } else {
                        errorState.value.company = true;
                        errorMsg.value.company = "Projenin yapıldığı firmayı seçiniz"
                    }

                } else {
                    errorState.value.projectType = true;
                    errorMsg.value.projectType = "Proje tipini seçiniz";
                }
            }else {
              errorState.value.all = true;
              errorMsg.value.all = "Tüm alanları doldurunuz";
            }
        }

        return { selectProject, projectPrice, tryToUsd, tryToEuro, formValidation, errorMsg, errorState, projectName, projectDetail, detailLength, saveProjectForm, search, items, searchCompany }
    }

}
</script>

<style scoped>
.add-area {
    display: flex;
    flex-direction: column;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin: 10px 0;
}

.radio-area {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    width: 10px;
}
</style>