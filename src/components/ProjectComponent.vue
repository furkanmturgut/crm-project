<template>
    <TDataTable :value="filteredProject" paginator :rows="7" tableStyle="width:100%;">
        <TColumn field="pName" sortable header="Proje Adı" style="20%"></TColumn>
        <TColumn v-if="!isUser" field="pCompany" header="Proje Firma" style="20%"></TColumn>
        <TColumn field="pPrice" sortable header="Proje Tutarı" style="20%"></TColumn>
        <TColumn field="pType" header="Proje Tipi" style="20%"></TColumn>
        <TColumn field="pDetail" header="Proje Açıklama" style="20%"></TColumn>
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
            required: true
        }
    },
    setup(props) {
        const auth = getAuth(app);
        // const firestore = getFirestore(app);
        const compName = ref(null);
        const isUser = ref(false);
        const user = auth.currentUser;
        const filteredProject = ref([]);

        onMounted(() => {
            if (user !== null) {
                compName.value = user.displayName; 
                if (user.displayName !== null) {
                    isUser.value = true;
                    console.log("C Name  1: ", compName.value);
                    propsFilter(props.projectList, compName.value);
                } else {
                    filteredProject.value = props.projectList
                }
            }

        });
        // Diger yöntem
        const propsFilter = (list, cName) => {
            console.log("C Name : ", cName);
            console.log("List : ", list.length);
            const q = list.filter((item) => {
                return item.pCompany == cName;
            });
            console.log("Query : ", q);
            filteredProject.value = q;
            console.log("Filtered null : ", filteredProject.value);
        }
       
        // Bu filtre basit yöntem 
        // const filterProject = async () => {
        //     const q = query(collection(firestore, "projects"), where("pCompany", "==", compName.value));
        //     await getDocs(q).then((response) => {
        //         response.forEach(element => {
        //             filteredProject.value.push(element.data());
        //         });
        //     })
        // }



        return { isUser, filteredProject }
    }
}
</script>

<style></style>