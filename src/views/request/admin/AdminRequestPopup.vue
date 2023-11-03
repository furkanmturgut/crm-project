<template>
  <PVDialog :header="'Talebi Yanıtla'" :closeDialog="closeDialog" :btnLabel="'Yanıtla'" @onSubmit="sendRequest">
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
              <TDropdown :options="requestState" placeholder="Talep Bekliyor" optionLabel="name"
                v-model="selectedRequest">
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
import { getFirestore, where, collection, query, onSnapshot, updateDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebase/config';
import PVDialog from '@/components/PVDialog.vue';
import { uid } from 'uid';
import emailjs from '@emailjs/browser';

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
    const selectedRequest = ref();
    const sendRequestDesc = ref('');
    const errorState = ref({ reqDesc: false });
    const errorMsg = ref({ reqDesc: null });
    const firestore = getFirestore(app);
    const reqList = ref([]);
    const reqCount = ref(null);

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

    const selectedUpdateRequest = async () => {
      const q = query(collection(firestore, "requests"), where("id", "==", props.data.id));
      onSnapshot(q, (snapshot) => {
        snapshot.forEach((item) => {
          const docDat = item.data();
          const updatedData = { ...docDat, state: true, };
          updateDoc(item.ref, updatedData);
        });
      });
    }

    const requestStateCount = async () => {
      const q = query(collection(firestore, "requests"), where("company", "==", props.data.company));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          reqList.value.push(item.data());
        });
      });

      const filteredReq = reqList.value.filter((item) => {
        return item.state === false;
      });
      reqCount.value = filteredReq.length;
      console.log(reqCount.value)
      const qa = query(collection(firestore, "customers"), where("compName", "==", props.data.company));
      await getDocs(qa).then((snapshot) => {
        snapshot.forEach((item) => {
          const docDat = item.data();
          const updatedData = { ...docDat, requestCount: reqCount.value };
          updateDoc(item.ref, updatedData);
        });
      });
    }

    const sendRequest = () => {
      if (sendRequestDesc.value.length >= 20) {
        console.log(selectedRequest.value.name);

        /* bu durumda sendRequest adli tabloya yeni kayit ekledik state degisseydi
           hem güncelleme hem de sendRequest'e kayit almam gerekirdi
        */
        if (selectedRequest.value.name === "Talep Bekliyor" || selectedRequest.value == undefined) {
          let sendData = {
            id: props.data.id,
            state: false,
            desc: sendRequestDesc.value,
            companyName: props.data.company,
            date: serverTimestamp()
          };
          addSendRequest(sendData);
          requestStateCount();
          selectedUpdateRequest();
          props.closeDialog(true);
          toastSuccess("Yanıtınız iletildi ve talep durumu bekliyor");

        } else if (selectedRequest.value.name == "Talep Alındı") {
          requestStateCount();
          selectedUpdateRequest();
          let sendData = {
            id: uid(),
            state: true,
            desc: sendRequestDesc.value,
            reply: props.data,
            companyName: props.data.company,
            date: serverTimestamp()
          };
          // email gonderme islemi
          const templateParams = {
            to_name: "Furkan Turgut",
            message: "Talebiniz alınmıştır",
            from_name: props.data.company,
            reply_to: props.data.mail,
          };
          emailjs.send('service_s90kabq', 'template_995nqvv', templateParams, 'cJIuRqM5MflTYudFw');
          addSendRequest(sendData);
          props.closeDialog(true);
          toastSuccess("Yanıtınız iletildi ve talep alındı");
        }
      } else {
        toastError("Talebin iletilmesi için tüm alanları doldurunuz");
      }
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