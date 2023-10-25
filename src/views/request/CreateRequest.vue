<template>
    <div class="request-area">
        <header-component :mainTitle="'Taleplerim'" :btnTitle="'Talep Oluştur'"
            @btnClick="addRequestBtn"></header-component>
        <TDynamicDialog></TDynamicDialog>
        
        <br />
        <TDataTable :value="projectList" showGridlines paginator :rows="7" tableStyle="width:100%;">
            <TColumn field="project" header="Proje Adı" style="20%"></TColumn>
            <TColumn field="company" header="Firma" style="20%"></TColumn>
            <TColumn field="title" header="Talep Başlığı" style="20%"></TColumn>
            <TColumn field="desc" header="Talep Açıklama" style="20%"></TColumn>
            <TColumn field="state" header="Talep Durumu" style="20%">
                <template #body="slotProps">
                    <TTag :value=" slotProps.data.state ? 'Talep Alındı' : 'Talep Bekliyor ' " :severity="getSeverity(slotProps.data)" />
                </template>
            </TColumn>
        </TDataTable>
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import { defineAsyncComponent, onMounted, ref, provide } from 'vue';
import { useDialog } from "primevue/usedialog";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import { app } from '@/firebase/config';
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
            });
        }

        // BU PROVIDE ILE BUTUN DIALOGLARI ACIP KAPATIYORUZ //
        provide("dialogRef",dialog);

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
            addRequest();
        }


        return { addRequestBtn, addRequest, projectList,getSeverity }
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