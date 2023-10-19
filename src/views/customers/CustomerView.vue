<template>
  <div class="customer-panel">
    <header-component :mainTitle="'Müşteriler'" :btnTitle="'Müşteri Ekle'" @btnClick="addCustomer"></header-component>
    <TDynamicDialog></TDynamicDialog>

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
    <div style="margin-top:20px; display:flex; flex-direction:column; align-items: center; justify-content:center;" v-else>
      <TSpinner style="height: 50px; width: 50px;"></TSpinner>
    </div>

  </div>
</template>

<script>
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import HeaderComponent from '@/components/HeaderComponent.vue';
export default {
  name: "CustomerView",
  components:{HeaderComponent},
  setup() {
    const AddCustomerPopup = defineAsyncComponent(() => import('@/views/customers/AddCustomerPopup.vue'));
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
      });
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

</style>