<template>
    <div class="request-area">
        <header-component :mainTitle="'Taleplerim'" :btnTitle="'Talep Oluştur'"
            @btnClick="addRequestBtn"></header-component>
            <add-request-popup :closeDialog="closeDialog"></add-request-popup>
        <br />
        <div class="component-area-project">
            <PVDataTable :dataList="projectList" :visibleState="false">
                <template #columnSlot>
                    <TColumn field="project" header="Proje Adı"></TColumn>
                    <TColumn field="company" header="Firma"></TColumn>
                    <TColumn field="title" header="Talep Başlığı"></TColumn>
                    <TColumn field="desc" header="Talep Açıklama"></TColumn>
                    <TColumn field="state" header="Talep Durumu">
                        <template #body="slotProps">
                            <TTag :value="slotProps.data.state ? 'Talep Alındı' : 'Talep Bekliyor '"
                                :severity="getSeverity(slotProps.data)" />
                        </template>
                    </TColumn>
                </template>
            </PVDataTable>
        </div>
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import PVDataTable from "@/components/PVDataTable.vue";
import { onMounted, ref } from 'vue';
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import { app } from '@/firebase/config';
import { getAuth } from "firebase/auth";
import AddRequestPopup from '@/views/request/AddRequestPopup.vue';
export default {
    name: "CreateRequest",
    components: {
        HeaderComponent, PVDataTable,AddRequestPopup
    },
    setup() {
        const auth = getAuth(app);
        const user = auth.currentUser;
        const firestore = getFirestore(app);
        const projectList = ref([]);
        const isDialog = ref(false);
        onMounted(async () => {
            if (user.displayName != null) {
                const q = query(collection(firestore, "requests"), where("company", "==", user.displayName));
                await getDocs(q).then((snapshot) => {
                    snapshot.forEach((item) => {
                        projectList.value.push(item.data());
                    });
                })
            }
        });

        // Column icinde yer alan tag elementiin rengi degistirildi
        const getSeverity = (project) => {
            switch (project.state) {
                case true:
                    return 'success'
                case false:
                    return 'danger'
            }
        }

        const addRequestBtn = () => {
            isDialog.value = true;
        }

        const closeDialog = () => {
            isDialog.value = false;
        }


        return { addRequestBtn, projectList, getSeverity,closeDialog,isDialog }
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