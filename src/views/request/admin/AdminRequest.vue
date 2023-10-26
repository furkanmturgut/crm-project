<template>
  <div class="request-area">
    <header-component :mainTitle="'Tüm Talepler'"></header-component>

    <TContextMenu ref="menu" :model="items" @select="handleMenuItem">
      <template #item="{ props, label }">
        <span style="margin: 8px  10px; cursor:pointer; height: 20px;" v-bind="props.icon" />
        <span style="margin: 8px  0; cursor: pointer; height: 20px;">{{ label }}</span>
      </template>
    </TContextMenu>

    <TDynamicDialog></TDynamicDialog>
    <TDataTable @contextmenu="onCellRightClick" selectionMode="single" aria-haspopup="true"
      v-model:selection="selectedRequest" v-model:filters="filters" :value="requestList"  paginator
      :rows="10" tableStyle="min-width:100%;" filterDisplay="row" resizableColumns columnResizeMode="expand">

      <template #header>
        <div style="display: flex; justify-content: end;">
          <TButton icon="pi pi-refresh" rounded raised @click="refreshData"
            style="color:white; background-color: turquoise; border: 1px solid turquoise; margin-right: 10px;" />
        
          <download-excel :data="requestList" >
            <TButton icon="pi pi-download" rounded raised
            style="color:white; background-color: turquoise; border: 1px solid turquoise;"/>
          </download-excel>

        </div>
      </template>

      <TColumn field="project" header="Proje Adı" exportHeader="Proje 1"></TColumn>
      <TColumn field="company" header="Firma"></TColumn>
      <TColumn field="title" header="Talep Başlığı"></TColumn>
      <TColumn field="desc" header="Talep Açıklama"></TColumn>
      <TColumn field="state" header="Talep Durumu" :showFilterMenu="false" style="min-width: 50px;">
        <template #body="{ data }">
          <TTag :value="data.state ? 'Talep Alındı' : 'Talep Bekliyor '" :severity="getSeverity(data.state)" />
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <TDropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Durum Seçin"
            showClear class="dropdown-style">
            <template #option="slotProps">
              <TTag :value="slotProps.option ? 'Talep Alındı' : 'Talep Bekliyor'"
                :severity="getSeverity(slotProps.option)" />
            </template>
          </TDropdown>
        </template>

      </TColumn>
    </TDataTable>

    <TToast></TToast>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { getFirestore, collection, query, updateDoc, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { defineAsyncComponent, onMounted, ref, provide } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { toastSuccess } from '@/components/Base/toast';
import { FilterMatchMode } from 'primevue/api';
export default {
  components: { HeaderComponent },
  name: "AdminRequest",
  setup() {
    const menu = ref();
    // hucrede secilen satir
    const selectedRequest = ref();
    const dialog = useDialog();
    const filters = ref();
    const AdminReqPopup = defineAsyncComponent(() => import('@/views/request/admin/AdminRequestPopup.vue'));
    const items = ref([
      { label: "Talebi Yanıtla", icon: 'pi pi-send', command: () => handleMenuItem('send') },
      { separator: true },
      {
        label: "Talebi Al", icon: 'pi pi-check-circle', command: () => handleMenuItem('addRequest')
      }
    ]);

    // init Filters ile hem filtre silme hemde filtreleme islemleri yapilir

    const initFilters = () => {
      filters.value = {
        state: { value: null, matchMode: FilterMatchMode.EQUALS },
      };
    }
    initFilters();

    const statuses = ref([true, false]);
    const firestore = getFirestore(app);
    const requestList = ref([]);
    onMounted(() => {
      getRequestData();
    });

    // Popup'a verimizi gönderdik
    provide("selectedRequest", selectedRequest);

    const getRequestData = async () => {
      const q = query(collection(firestore, "requests"), orderBy("date", 'desc'));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          requestList.value.push(item.data());
        });
      });
    }

    // Tag stil ayari
    const getSeverity = (project) => {
      switch (project) {
        case true:
          return 'success'
        case false:
          return 'danger'
      }
    }

    const selectedUpdateRequest = async () => {
      const q = query(collection(firestore, "requests"), where("id", "==", selectedRequest.value.id));
      onSnapshot(q, (snapshot) => {
        snapshot.forEach((item) => {
          const docDat = item.data();
          const updatedData = { ...docDat, state: true };
          updateDoc(item.ref, updatedData);
        });
      });
    }

    // Context menu elementine tiklandigi durum
    const handleMenuItem = (send) => {

      if (send === 'send') {
        dialog.open(AdminReqPopup, {
          props: {
            header: 'Talebi Yanıtla',
            style: {
              width: '450px'
            },
            modal: true
          }
        });
      } else if (send === 'addRequest') {

        selectedUpdateRequest();
        // Burada veri listesi sifirlandi ve veriyi yeniden çektik
        requestList.value = [];
        getRequestData();
        toastSuccess("Talep durumu alındı");
      }
    }

    const onCellRightClick = (event) => {
      if (selectedRequest.value !== undefined && !selectedRequest.value.state) {
        menu.value.show(event);
      }
    }

    const refreshData = () => {
      requestList.value = [];
      getRequestData();
      initFilters();
    }

    return { requestList, getSeverity, menu, items, selectedRequest, onCellRightClick, handleMenuItem, filters, statuses, refreshData }
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

.dropdown-style {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>