<template>
    <div class="request-area">
        <header-component :mainTitle="'Taleplerim'" :btnTitle="'Geçmiş Talepleri Listele'"
            @btnClick="historyRequest"></header-component>
        <TDynamicDialog></TDynamicDialog>
        <TButton label="Talep Oluştur" @click="addRequest"
            style="width: 26%; height: 64%; background-color: turquoise; border:1px solid turquoise; color:black;">
        </TButton>

        <TDataTable :value="projectList" showGridlines paginator :rows="7" tableStyle="width:100%;">
            <TColumn field="project" sortable header="Proje Adı" style="25%"></TColumn>
            <TColumn field="company" sortable header="Firma" style="25%"></TColumn>
            <TColumn field="title" header="Talep Başlığı" style="25%"></TColumn>
            <TColumn field="desc" header="Talep Açıklama" style="25%"></TColumn>
        </TDataTable>
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { defineAsyncComponent, onMounted,ref } from 'vue';
import { useDialog } from "primevue/usedialog";
import { getFirestore,query,collection,where,getDocs } from "firebase/firestore";
import {app} from '@/firebase/config';
import { getAuth } from "firebase/auth";
export default {
    name: "CreateRequest",
    components: {
        HeaderComponent
    },
    setup() {
        const dialog = useDialog();
        const AddRequest = defineAsyncComponent(() => import('@/views/request/AddRequestPopup.vue'));
        const auth = getAuth(app);
        const user = auth.currentUser;
        const firestore = getFirestore(app);
        const projectList = ref([]);
        const addRequest = () => {
            dialog.open(AddRequest, {
                props: {
                    header: 'Talep Oluştur',
                    style: {
                        width: '450px'
                    },
                    modal: true
                }

            })
        }

        onMounted(async () => {
            if(user.displayName != null ){
                const q = query(collection(firestore,"requests"),where("company","==",user.displayName));
                await getDocs(q).then((snapshot) => {
                    snapshot.forEach((item) => {
                        projectList.value.push(item.data());
                    });
                })
            }
        });

        console.log("Item : ", projectList.value);

        const historyRequest = () => {
            console.log("A")
        }


        return { historyRequest, addRequest, projectList }
    }
}

</script>

<style scoped>
.request-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>