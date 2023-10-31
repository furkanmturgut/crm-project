<template>
    <PVDialog :closeDialog="closeDialog" :header="'Talep Bildir'">
        <template #dialogForm>
            <form @submit.prevent="sendToRequest" style="display: flex; flex-direction: column;">
                <label>Projeyi seçin</label>
                <TDropdown v-model="searchProject" :options="projectList" optionLabel="pName" placeholder="Proje Seçin"
                    showClear>
                </TDropdown>
                <label>Talep Başlığı</label>
                <TInputText placeholder="Başlık" v-model="sendTitle" @input="formValidation(0)"></TInputText>
                <small style="font-weight: bold; color:red;" v-if="errorState.title">{{ errorMsg.title }}</small>

                <label>Talep İçeriği</label>
                <TextArea placeholder="Proje Açıklaması" autoResize rows="5" cols="30" v-model="sendContent"
                    @input="formValidation(1)"></TextArea>
                <small style="font-weight: bold; color:red;" v-if="errorState.description">{{ errorMsg.description
                }}</small>

                <TButton style="margin-top:20px; background-color: turquoise;" type="submit" label="TALEBİ OLUŞTUR">
                </TButton>
                <small style="font-weight: bold; color:red;" v-if="errorState.all">{{ errorMsg.all }}</small>

                <TToast></TToast>
            </form>
        </template>
    </PVDialog>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getFirestore, getDocs, where, query, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase/config';
import addRequest from '@/firebase/addRequest';
import { toastSuccess } from '@/components/Base/toast';
import PVDialog from '@/components/PVDialog.vue';
export default {
    name: "AddRequestPopup",
    components: { PVDialog },
    props: {
        closeDialog:{
            type:Function,
            required:true
        }
    },
    setup() {
        const searchProject = ref(null);
        const sendTitle = ref('');
        const sendContent = ref('');
        const firestore = getFirestore(app);
        const auth = getAuth(app);
        let compName = null;
        const user = auth.currentUser;
        const projectList = ref([]);
        const requestCompayId = ref([]);
        const reqCount = ref(null);
        const errorState = ref({ title: false, description: false, all: false });
        const errorMsg = ref({ title: null, description: null, all: null });
        onMounted(async () => {
            if (user != null) {
                if (user.displayName != null) {
                    compName = user.displayName;
                }
            }
            const q = query(collection(firestore, "projects"), where("pCompany", "==", compName));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((item) => {
                    projectList.value.push(item.data());
                });
            });
        });

        const formValidation = (type) => {
            switch (type) {
                case 0:
                    if (sendTitle.value.length < 5) {
                        errorState.value.title = true;
                        errorMsg.value.title = "En az 5 karakter başlık yazın";
                    } else {
                        errorState.value.title = false;
                    }
                    break;
                case 1:
                    if (sendContent.value.length < 20) {
                        errorState.value.description = true;
                        errorMsg.value.description = "En az 20 karakter açıklama yazın";
                    } else {
                        errorState.value.description = false;
                    }
                    break;
            }
        }

        // taleplerden gerekli firmanınn toplam talebini aldık ve customers'e eklendi!
        const totalRequest = async () => {
            console.log(user.displayName);
            const q = query(collection(firestore, "requests"), where("company", "==", user.displayName));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((item) => {
                    requestCompayId.value.push(item.data());
                });
            });
            console.log(requestCompayId.value);
            const filteredData = requestCompayId.value.filter((item) => {
                return item.state === false
            });
            reqCount.value = filteredData.length;

            console.log(typeof reqCount.value);
            const qa = query(collection(firestore, "customers"), where("compName", "==", user.displayName));
            await getDocs(qa).then((snapshot) => {
                snapshot.forEach((item) => {
                    const docDat = item.data();
                    const updatedData = { ...docDat, requestCount: reqCount.value };
                    updateDoc(item.ref, updatedData);
                });
            });
        }

        // Seçilen proje tekrar filtrelenecek!
        const sendToRequest = async () => {
            if (sendTitle.value.length >= 5 && sendContent.value.length >= 20) {
                if (searchProject.value != null) {
                    const id = Date.now();
                    let data = {
                        id: id,
                        title: sendTitle.value,
                        desc: sendContent.value,
                        date: serverTimestamp(),
                        project: searchProject.value.pName,
                        company: user.displayName,
                        state: false,
                    };
                    await addRequest(data);
                    toastSuccess("Talep başarıyla oluşturuldu");
                    totalRequest();
                    setTimeout(() => {
                        // close dialog
                    }, 1000);
                } else {
                    errorState.value.all = true;
                    errorMsg.value.all = "Lütfen proje seçiniz";
                }
            } else {
                errorState.value.all = true;
                errorMsg.value.all = "Lütfen tüm alanları doldurunuz";
            }
        }

        return { searchProject, sendContent, sendTitle, projectList, sendToRequest, formValidation, errorMsg, errorState }
    }

}
</script>

<style scoped></style>