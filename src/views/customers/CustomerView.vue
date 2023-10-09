<template>
  <div class="customer-panel">
    <h1 style="margin-top:20px">Müşteri Ekranı</h1>
    <div class="customer-btn-area">
      <div class="add-customer" @click="addCustomer">

        <TDynamicDialog></TDynamicDialog>
        <span class="btn-name"> Müşteri Ekle</span>
      </div>
      <div class="add-customer">
        <span class="btn-name"> Müşteri Talepleri</span>
      </div>
    </div>

    <span style="font-weight: bold; margin:20px 0;  font-size: 22px;">Tüm Müşteriler</span>
    <div v-if="customerList.length != 0" class="customer-btn-area">
      <TDataTable :value="customerList" paginator :rows="7" tableStyle="width:100%;">
        <TColumn field="compName" sortable header="Firma Adı" style="25%"></TColumn>
        <TColumn field="compPerson" header="İletişim Personeli" style="25%"></TColumn>
        <TColumn field="compPhone" header="İletişim" style="25%"></TColumn>
        <TColumn field="compEmail" header="E-Mail" style="25%"></TColumn>
        <TColumn field="compAddress" header="Adres" style="25%"></TColumn>
      </TDataTable>
    </div>
    <div style="margin-top:20px;" v-else>
      <span class="no-customer">Kayıtlı müşteriniz bulunmamaktadır</span>
    </div>

  </div>
</template>

<script>
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';

export default {
  name: "CustomerView",
  setup() {
    const AddCustomerPopup = defineAsyncComponent(() => import('@/views/popup/AddCustomerPopup.vue'));
    const dialog = useDialog();
    const addCustomer = () => {
      dialog.open(AddCustomerPopup, {
        props: {
          header: "Müşteri Ekle",
          style: {
            width: '450px'
          },
          modal: true
        }
      })

    }
    const customerList = ref([]);
    const firestore = getFirestore(app);
    onMounted(async () => {
      const q = query(collection(firestore, "customers"));
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((item) => {
          customerList.value.push(item.data());

        })
      })
    });

    return { addCustomer, customerList }
  }
}
</script>

<style scoped>
.btn-name {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;

}

.customer-panel {
  width: 100%;
  height: max-content;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

}

.add-customer {
  width: 26%;
  height: 64px;
  background-color: turquoise;
  margin: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.add-customer:hover {
  background-color: #719d9a;
}

.customer-btn-area {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.no-customer {
  font-weight: bold;
  color: black;
}
</style>