<template>
    <form @submit.prevent="sendToRequest" style="display: flex; flex-direction: column;">
        <label>Projeyi seçin</label>
        <TAutoComplete inputStyle="width:100%"  v-model="searchProject" @change="projectList" :suggestions="items"
            optionLabel="name" @complete="search"></TAutoComplete>

        <label>Talep Başlığı</label>
        <TInputText placeholder="Başlık" v-model="sendTitle" @input="formValidation(0)"></TInputText>
        <span v-if="errorState.title">{{ errorMsg.title }}</span>

        <label>Talep İçeriği</label>
        <TextArea placeholder="Proje Açıklaması" autoResize rows="5" cols="30" v-model="sendContent"
            @input="formValidation(1)"></TextArea>
        <span v-if="errorState.description">{{ errorMsg.description }}</span>

        <TButton style="margin-top:20px" type="submit" label="Talebi Oluştur"></TButton>
        <span v-if="errorState.all">{{ errorMsg.all }}</span>

        <TToast></TToast>
    </form>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getFirestore, getDocs, where, query, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase/config';
import addRequest from '@/firebase/addRequest';
export default {
    setup() {
        const searchProject = ref(null);
        const sendTitle = ref('');
        const sendContent = ref('');
        const firestore = getFirestore(app);
        const auth = getAuth(app);
        let compName = null;
        const user = auth.currentUser;
        const projectList = ref([]);
        const items = ref([]);
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

        const search = () => {
            items.value = [];
            const filteredProject = projectList.value.filter((item) => {
                return item.pName.toLowerCase().includes(searchProject.value.toLowerCase());
            });

            filteredProject.forEach((item) => {
                items.value.push({
                    name: item.pName
                });
            });
        }

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

        // Seçilen porje tekrar filtrelenecek!
        const sendToRequest = async () => {
            if (sendTitle.value.length > 5 && sendContent.value.length > 19) {
                if (searchProject.value != null ) {
                    const a = JSON.stringify(searchProject.value.name);
                    const projectName = a.replace(/"/g, '');
                    console.log("Project name : ", projectName);
                    let data = {
                        title: sendTitle.value,
                        desc: sendContent.value,
                        date: serverTimestamp(),
                        project: projectName,
                        company:user.displayName,
                        state: false
                    };
                    await addRequest(data);
                } else {
                    errorState.value.all = true;
                    errorMsg.value.all = "Lütfen proje seçiniz";
                }
            } else {
                errorState.value.all = true;
                errorMsg.value.all = "Lütfen tüm alanları doldurunuz";
            }
        }

        return { searchProject, sendContent, sendTitle, projectList, search, items, sendToRequest, formValidation, errorMsg, errorState }
    }

}
</script>

<style scoped></style>