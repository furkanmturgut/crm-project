<template>
  <PVDialog :header="'Talebi Yanıtla'" :closeDialog="closeDialog" :btnLabel="'Yanıtla'">
    <template #dialogForm>
      <form @submit.prevent="sendRequest">
        <div class="add-area">
          <div class="row-element">
            <div class="input-left-element">
              <label>Talep Eden Firma</label>
              <span class="request-span">{{ data.company }}</span>

            </div>
            <div class="input-right-element">
              <label>Talep Tarih</label>
              <span class="request-span">{{ dateFormat }}</span>
            </div>
          </div>

          <div class="row-element">
            <div class="input-left-element">
              <label>Talep Başlık</label>
              <span class="request-span">{{ data.title }}</span>
            </div>
            <div class="input-right-element">
              <label>Talep Açıklama</label>
              <span class="request-span">{{ data.desc }}</span>
            </div>
          </div>

          <div class="row-element">
            <div class="input-left-element">
              <label>Proje Adı</label>
              <span class="request-span">{{ data.project }}</span>
            </div>
            <div class="input-right-element">
              <label>Talep Durumu </label>
              <TDropdown :options="requestState" placeholder="Talep Bekliyor" optionLabel="name" v-model="selectedRequest"
                >
              </TDropdown>
            </div>
          </div>



          <label style="margin: 10px 0;">Talebe Yanıt Yaz</label>
          <TextArea @input="formValidation(0)" v-model="sendRequestDesc" autoResize rows="5" cols="30"></TextArea>
          <small style="color: red; font-weight: bold;" v-if="errorState.reqDesc">{{ errorMsg.reqDesc }}</small>

        </div>
      </form>
    </template>
  </PVDialog>
</template>

<script>
import { ref } from 'vue';
import addSendRequest from '@/firebase/addSendRequest';
import { toastError, toastSuccess } from '@/components/Base/toast';
import { getFirestore, where, collection, query, onSnapshot, updateDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import PVDialog from '@/components/PVDialog.vue';
export default {
  name: "AdminRequestPopup",
  components: { PVDialog },
  props: {
    closeDialog: {
      type: Function,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const selectedRequest = ref(false);
    const sendRequestDesc = ref('');
    const errorState = ref({ reqDesc: false });
    const errorMsg = ref({ reqDesc: null });
    const firestore = getFirestore(app);

    // dropdown ici verileri doldurduk
    const requestState = ref([
      { name: 'Talep Alındı', state: true },
      { name: "Talep Bekliyor", state: false }
    ]);

    // timestamp to date format
    let date = new Date(props.data.date.toDate());
    let dateFormat = date.toLocaleString('tr-TR');

    const formValidation = (type) => {
      switch (type) {
        case 0:
          if (sendRequestDesc.value.length < 20) {
            errorState.value.reqDesc = true;
            errorMsg.value.reqDesc = "En az 20 karakter açıklama girin"
          } else {
            errorState.value.reqDesc = false;
          }
          break;
      }
    }

    const sendRequest = () => {
      if (sendRequestDesc.value.length >= 20) {
        /* bu durumda sendRequest adli tabloya yeni kayit ekledik state degisseydi
           hem güncelleme hem de sendRequest'e kayit almam gerekirdi
        */
        if (!selectedRequest.value) {
          let sendData = {
            id: props.data.id,
            state: selectedRequest.value,
            desc: sendRequestDesc.value
          };
          addSendRequest(sendData);
          toastSuccess("Yanıtınız iletildi");
        } else if (selectedRequest.value) {
          updateRequest();
          let sendData = {
            id: props.data.id,
            state: selectedRequest.value.state,
            desc: sendRequestDesc.value
          };
          addSendRequest(sendData);
          toastSuccess("Yanıtınız iletildi ve talep alındı");
        }
      } else {
        toastError("Talebin iletilmesi için tüm alanları doldurunuz");
      }

    }

    const updateRequest = () => {
      const q = query(collection(firestore, "requests"), where("id", "==", props.data.id));
      onSnapshot(q, (snapshot) => {
        snapshot.forEach((item) => {
          const docDat = item.data();
          const updatedData = { ...docDat, state: selectedRequest.value.state };
          updateDoc(item.ref, updatedData);
        });
      });
    }

    return { requestState, selectedRequest, dateFormat, sendRequestDesc, formValidation, errorMsg, errorState, sendRequest }
  }

}
</script>

<style scoped>
.add-area {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
}

.request-span {
  display: flex;
  color: gray;
}

.request-div {
  width: 100%;
  border: 1px solid #d9dee2;
  height: 50px
}
</style>