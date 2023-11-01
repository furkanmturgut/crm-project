<template>
  <div class="project-list">
    <header-component :mainTitle="'Projeler & Ürünler'" :btnTitle="'Proje Ekle'" @btnClick="isDialog = true"
      :isUser="isUser"></header-component>
    <project-popup :closeDialog="closeDialog" v-if="isDialog"></project-popup>
    <span style="font-weight: bold; margin:20px 0;  font-size: 22px;">Tüm Projeler</span>
    <div class="component-area-project" v-if="projectList.length !== 0">

      <PVDataTable :dataList="projectList" :visibleState="true" @refreshData="refreshData" :excelName="'projectList'">

        <template #columnSlot>
          <TColumn field="pName" sortable header="Proje Adı"></TColumn>
          <TColumn v-if="!isUser" field="pCompany" header="Proje Firma"></TColumn>
          <TColumn field="pPrice" sortable header="Proje Tutarı (TL)"></TColumn>
          <TColumn field="pType" header="Proje Tipi"></TColumn>
          <TColumn field="pDetail" header="Proje Açıklama" style="max-width: 250px;"></TColumn>
        </template>

      </PVDataTable>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import HeaderComponent from '@/components/HeaderComponent.vue';
import PVDataTable from '@/components/PVDataTable.vue';
import ProjectPopup from './ProjectPopup.vue';
import { app } from '@/firebase/config';
import { getAuth } from 'firebase/auth';

export default {
  name: 'ProjectView',
  components: { PVDataTable, HeaderComponent,ProjectPopup },
  setup() {
    const projectList = ref([]);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    const compName = ref(null);
    const isUser = ref(false);
    const isDialog = ref(false);
    
    const closeDialog = (onSuccess) => {
      if(onSuccess === true){
        projectList.value = [];
        getData();
        isDialog.value= false;
      }
      isDialog.value = false;
    }

    const getData = async () => {
    
        if (user && user.displayName !== null) {
          isUser.value = true;
          compName.value = user.displayName;
        }
      
      const q = query(collection(firestore, "projects"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          projectList.value.push(item.data());
        });
      });
        if(compName.value) {
          const filteredData = projectList.value.filter((item) => {
            return item.pCompany == compName.value;
          });
          projectList.value = [];
          projectList.value = filteredData;
        }
    }

    onMounted(async () => {
      getData();
    });

    const refreshData = () => {
      projectList.value = [];
      getData();
    }

    return { compName, isUser, projectList, refreshData, closeDialog, isDialog }

  }

}
</script>

<style scoped>
.project-list {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>