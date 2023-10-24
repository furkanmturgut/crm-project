<template>
  <div class="request-area">
    <header-component :mainTitle="'Tüm Talepler'"></header-component>
    <TContextMenu ref="menu" :model="items">
      <template #item="{ props, label }">
        <span style="margin: 8px 10px;" v-bind="props.icon" />
        <span style="margin: 8px 0;">{{ label }}</span>
      </template>
    </TContextMenu>

    <TDataTable @contextmenu="onImageRightClick" aria-haspopup="true" v-model:selection="selectedRequest"
      :value="requestList" showGridlines paginator :rows="7" tableStyle="width:100%;">
      <TColumn selectionMode="single" headerStyle="width: 3rem"></TColumn>
      <TColumn field="project" header="Proje Adı" style="20%"></TColumn>
      <TColumn field="company" header="Firma" style="20%"></TColumn>
      <TColumn field="title" header="Talep Başlığı" style="20%"></TColumn>
      <TColumn field="desc" header="Talep Açıklama" style="20%"></TColumn>
      <TColumn field="state" header="Talep Durumu" style="20%">
        <template #body="slotProps">
          <TTag :value="slotProps.data.state ? 'Talep Alındı' : 'Talep Bekliyor '"
            :severity="getSeverity(slotProps.data)" />
        </template>
      </TColumn>
    </TDataTable>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { onMounted, ref } from 'vue';
export default {
  components: { HeaderComponent },
  name: "AdminRequest",
  setup() {
    const menu = ref();
    const selectedRequest = ref();
    const items = ref([
      { label: "Talebi Yanıtla", icon: 'pi pi-send'},
      { separator: true },
      { label: "Sıraya Aldığını Bildir", icon: 'pi pi-list' }
    ]);
    const firestore = getFirestore(app);
    const requestList = ref([]);
    onMounted(async () => {
      const q = query(collection(firestore, "requests"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          requestList.value.push(item.data());
        });
      });
    });

    const getSeverity = (request) => {
      switch (request.state) {
        case true:
          return 'success'
        case false:
          return 'danger'
      }
    }

    const onImageRightClick = (event) => {
      if (selectedRequest.value) {
          menu.value.show(event);
      }
    }

    return { requestList, getSeverity, menu, items, selectedRequest, onImageRightClick }
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