<template>
    <TDataTable :value="filteredProject" paginator :rows="7" tableStyle="width:100%;">
        <TColumn field="pName" sortable header="Proje Adı" style="25%"></TColumn>
        <TColumn v-if="!isUser" field="pCompany.name" header="Proje Firma" style="25%"></TColumn>
        <TColumn field="pPrice" sortable header="Proje Tutarı" style="25%"></TColumn>
        <TColumn field="pType" header="Proje Tipi" style="25%"></TColumn>
        <TColumn field="pDetail" header="Proje Açıklama" style="30%"></TColumn>
    </TDataTable>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase/config';
import { onMounted, ref } from 'vue';


export default {
    name: "ProjectComponent",
    props: {
        projectList: {
            type: Array,
            requried: true
        }
    },
    setup(props) {
        const auth = getAuth(app);
        const compName = ref(null);
        const isUser = ref(false);
        const user = auth.currentUser;
        const filteredProject = ref([]);
        onMounted(() => {
            if (user !== null && user.displayName !== null) {
                isUser.value = true;
                compName.value = user.displayName;
                console.log("Company Name : ", compName.value)
            }
            // 
            filterProject(props.projectList, compName.value)
        });

        const filterProject = (projectList, cName) => {
            filteredProject.value.push(projectList.filter((item) => {
                return item.pCompany.name == cName;
            }));
            // filteredProject.value.push(q);
            // console.log("Query : ", q);
            console.log("Fltered push : ", filteredProject.value)
        }

        return { isUser, filteredProject }
    }
}
</script>

<style></style>