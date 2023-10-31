<template>
  <div class="customer-panel">
    <header-component :mainTitle="'Müşteriler'" :btnTitle="'Müşteri Ekle'" @btnClick="addCustomer"></header-component>

    <add-customer-popup :closeDialog="closeDialog" v-if="isDialog"></add-customer-popup>

    <TContextMenu ref="menu" :model="items" @select="handleMenuItem">
      <template #item="{ props, label }">
        <span style="margin: 8px  10px; cursor:pointer; height: 20px;" v-bind="props.icon" />
        <span style="margin: 8px  0; cursor: pointer; height: 20px;">{{ label }}</span>
      </template>
    </TContextMenu>

    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;" v-if="isSpinner">
      <TSpinner style="height: 50px; width: 50px;"></TSpinner>
      <span style="font-weight: bold; color: turquoise;">Yükleniyor</span>
    </div>

    <span style="font-weight: bold; margin:20px 0;  font-size: 22px;" v-else>Tüm Müşteriler</span>
    <div class="component-area-project">
      <PVDataTable :dataList="customerList" v-model:selection="selectedRequest" @contextmenu="onCellRightClick"
        :visibleState="true" @refreshData="refreshData" :excelName="'customerList'">
        <template #columnSlot>
          <TColumn field="compName" sortable header="Firma Adı"></TColumn>
          <TColumn field="compPerson" header="İletişim Personeli"></TColumn>
          <TColumn field="compPhone" header="İletişim"></TColumn>
          <TColumn field="compEmail" header="E-Mail"></TColumn>
          <TColumn field="compAddress" header="Adres"></TColumn>
          <TColumn field="requestCount" sortable header="Çözülmemiş Talep Sayısı">
            <template #body="{ data }">
              <div
                :style="{ backgroundColor: data.requestCount === 0 ? 'springgreen' : data.requestCount >= 3 ? 'red' : 'gold' }">
                <label style="display: flex; justify-content: center; font-weight: bold;"
                  :style="{ color: data.requestCount >= 3 ? 'white' : 'black' }">{{ data.requestCount }}</label>
              </div>
            </template>
          </TColumn>
        </template>
      </PVDataTable>
    </div>

  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import HeaderComponent from '@/components/HeaderComponent.vue';
import PVDataTable from '@/components/PVDataTable.vue';
import AddCustomerPopup from './AddCustomerPopup.vue';
export default {
  name: "CustomerView",
  components: { HeaderComponent, PVDataTable, AddCustomerPopup },
  setup() {
    const isSpinner = ref(true);
    const selectedRequest = ref();
    const menu = ref();
    const isDialog = ref(false);

    const closeDialog  = () => {
      isDialog.value = false
    }

    const addCustomer = () => {
      isDialog.value = true;
    }
    const items = ref([
      { label: "Görüşme Başlat (Chat)", icon: 'pi pi-comment', command: () => handleMenuItem('meeting') },
      { separator: true },
      { label: "Görüşme Talebi Oluştur", icon: 'pi pi-calendar-times', command: () => handleMenuItem('meeting') },
      { separator: true },
      {
        label: "Talep Bilgileri", icon: 'pi pi-info-circle', command: () => handleMenuItem('requestInfo')
      }
    ]);

    // Context menu elementine tiklandigi durum
    const handleMenuItem = (route) => {
      if (route === "meeting") {
        console.log("Görüşme alanı");
      } else if (route === "requestInfo") {
        console.log("Dialog açılacak!");
      }

    }

    const onCellRightClick = (event) => {
      if (selectedRequest.value !== undefined) {
        menu.value.show(event);
      }
    }

    const customerList = ref([]);
    const firestore = getFirestore(app);
    onMounted(() => {
      getCustomerData();
    });

    const getCustomerData = async () => {
      const q = query(collection(firestore, "customers"));
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((item) => {
          customerList.value.push(item.data());
        });
      });

      isSpinner.value = false;
    }

    const refreshData = () => {
      customerList.value = [];
      getCustomerData();
    }

    return {  customerList, isSpinner, items, handleMenuItem, onCellRightClick, menu, selectedRequest, refreshData,addCustomer,closeDialog,isDialog }
  }
}
</script>

<style scoped>
.customer-panel {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>