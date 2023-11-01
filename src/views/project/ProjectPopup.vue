<template>
    <PVDialog :closeDialog="closeDialog" :header="'Proje Ekle'" @onSubmit="saveProjectForm">
        <template #dialogForm>
            <form @submit.prevent="saveProjectForm">
                <div class="row-element">
                    <div class="input-left-element">
                        <!-- Project Name -->
                        <label>Proje Adı</label>
                        <TInputText placeholder="Proje Adı Giriniz" v-model="projectName" @input="formValidation(0)">
                        </TInputText>
                        <small class="error-class" v-if="errorState.name">{{ errorMsg.name }}</small>
                    </div>
                    <div class="input-right-element">
                        <!-- Project Company -->
                        <label>Proje Teslim Edilecek Firma</label>
                        <TDropdown v-model="searchCompany" :options="customerList" optionLabel="compName"
                            placeholder="Firmayı Seçin" showClear></TDropdown>
                        <small class="error-class" v-if="errorState.company">{{ errorMsg.company
                        }}</small>
                    </div>
                </div>

                <div class="row-element">
                    <div class="input-left-element">
                        <!-- Project Price -->
                        <label>Proje Fiyat</label>
                        <TInputText :class="[errorState.currency ? 'p-invalid' : '']" placeholder="Proje Fiyatı TL"
                            v-model="projectPrice" type="number" @input="formValidation(1)"></TInputText>
                        <span class="error-class" v-if="errorState.currency">{{ errorMsg.currency
                        }}</span>
                        <div style="display: flex; flex-direction: column;"
                            v-if="projectPrice != '' && projectPrice.trim().length >= 0">
                            <small>Güncel Kur ile USD Fiyatı : <small style="font-weight: bold;"> {{
                                tryToUsd.toString().slice(0, 8) }}</small> </small>
                            <small>Güncel Kur ile EURO Fiyatı : <small style="font-weight: bold;"> {{
                                tryToEuro.toString().slice(0, 8) }}</small> </small>
                        </div>
                    </div>
                    <div class="input-right-element">
                        <!-- Project Type -->
                        <label>Proje Türü</label>
                        <TDropdown v-model="selectProjectType" :options="projectType" optionLabel="type"
                            placeholder="Proje Türü Seçin" showClear></TDropdown>
                        <small v-if="errorState.projectType" class="error-class">{{ errorMsg.projectType }}</small>

                    </div>
                </div>

                <div class="row-element">
                    <div class="input-left-element">
                        <!-- Project Detail -->
                        <label>Proje Açıklama</label>
                        <TextArea placeholder="Proje Açıklaması" autoResize rows="5" cols="30" v-model="projectDetail" style="width: 100%;"
                            @input="formValidation(2)"></TextArea>
                        <div style="width: 100%; margin-top:10px; display: flex; " v-if="detailLength <= 59">
                            <TKnob style="margin-right: auto;" :strokeWidth="5" v-model="detailLength" :max="60" :min="0"
                                :size="50" valueColor="blue" textColor="black"></TKnob>
                            <small class="error-class" v-if="errorState.detail">{{ errorMsg.detail }}</small>
                        </div>
                    </div>
                </div>

                <small v-if="errorState.all" class="error-class" style="display: flex; justify-content: center;">{{ errorMsg.all }}</small>
                <TToast></TToast>
            </form>
        </template>
    </PVDialog>
</template>

<script>
import axios from 'axios';
import { computed, ref } from 'vue';
import saveProject from '@/firebase/saveProject.js';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import PVDialog from '@/components/PVDialog.vue';
import { toastError, toastSuccess } from '@/components/Base/toast';
export default {
    name: "ProjectPopup",
    components: { PVDialog },
    props: {
        closeDialog: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const selectProject = ref(null);
        const searchCompany = ref(null);
        const customerList = ref([]);
        const firestore = getFirestore(app);
        const USD = ref(null);
        const EURO = ref(null);
        const selectProjectType = ref(null);
        const projectType = ref([
            { type: "Scada Web" },
            { type: "Masaüstü Yazılım" },
            { type: "Mobil Uygulama" },
            { type: "Fullstack Uygulama" }
        ]);
        const projectPrice = ref('');
        const projectName = ref('');
        const projectDetail = ref('');
        const errorState = ref({ currency: false, name: false, detail: false, projectType: false, company: false, all: false });
        const errorMsg = ref({ currency: null, name: null, detail: null, projectType: null, company: null, all: false });
        // AutoComplete islemi
        const getUserFunc = (async () => {
            const q = query(collection(firestore, "customers"));
            await getDocs(q).then((qSnapshot) => {
                qSnapshot.forEach((item) => {
                    customerList.value.push(item.data());
                });
            });
        });
        getUserFunc();


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
            if (projectName.value.length >= 5 && projectPrice.value.length > 0 && projectDetail.value.length >= 60) {
                if (selectProjectType.value != null) {
                    errorState.value.projectType = false;

                    if (searchCompany.value != null) {
                        errorState.value.company = false;

                        const data = {
                            pName: projectName.value,
                            pPrice: projectPrice.value,
                            pDetail: projectDetail.value,
                            pType: selectProjectType.value.type,
                            pCompany: searchCompany.value.compName,
                        };

                        await saveProject(data);
                        toastSuccess("Proje Başarıyla Eklendi.");

                        setTimeout(() => {
                            //close dialog
                            props.closeDialog(true);
                        }, 1000);
                    } else {
                        errorState.value.company = true;
                        errorMsg.value.company = "Projenin yapıldığı firmayı seçiniz"
                    }

                } else {
                    errorState.value.projectType = true;
                    errorMsg.value.projectType = "Proje tipini seçiniz";
                }
            } else {
                errorState.value.all = true;
                errorMsg.value.all = "Tüm alanları doldurunuz";
                toastError("Tüm alanları doldurunuz");
            }
        }

        return { selectProjectType, projectType, selectProject, projectPrice, tryToUsd, tryToEuro, formValidation, errorMsg, errorState, projectName, projectDetail, detailLength, saveProjectForm, customerList, searchCompany }
    }

}
</script>

<style scoped>
form {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin: 10px 0;
}
</style>