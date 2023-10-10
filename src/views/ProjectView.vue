<template>
  <div class="project-list">
    <h1 style="margin-top:20px">Projeler & Ürünler</h1>
    <div class="customer-btn-area">
      <div class="add-customer" @click="addProject">
        <TDynamicDialog></TDynamicDialog>
        <span class="btn-name">Proje Ekle</span>
      </div>

      <span style="font-weight: bold; margin:20px 0;  font-size: 22px;">Tüm Projeler</span>
      <div class="customer-btn-area">
        <TDataTable :value="projectList" paginator :rows="7" tableStyle="width:100%;">
          <TColumn field="pName" sortable header="Proje Adı" style="25%"></TColumn>
          <TColumn field="pCompany.name" header="Proje Firma" style="25%"></TColumn>
          <TColumn field="pPrice" sortable header="Proje Tutarı" style="25%"></TColumn>
          <TColumn field="pType" header="Proje Tipi" style="25%"></TColumn>
          <TColumn field="pDetail" header="Proje Açıklama" style="30%"></TColumn>
        </TDataTable>
      </div>

    </div>
  </div>
</template>

<script>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
export default {
  name: 'ProjectView',
  setup() {
    const dialog = useDialog();
    const projectList = ref([]);
    const firestore = getFirestore(app);
    const ProjectPopup = defineAsyncComponent(() => import("@/views/popup/ProjectPopup.vue"))
    const addProject = () => {
      dialog.open(ProjectPopup, {
        props: {
          header: "Proje Ekle",
          style: {
            width: '450px'
          },
          modal: true
        }
      })
    };

    onMounted(async () => {
      const q = query(collection(firestore, "projects"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          projectList.value.push(item.data());
        });
      })
    })

    return { addProject,projectList }

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

.customer-btn-area {
  width: 90%;
  height: max-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.btn-name {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;

}

.add-customer {
  width: 26%;
  height: 64px;
  background-color: turquoise;
  margin: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>