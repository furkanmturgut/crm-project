<template>
  <div class="main-area">
    <header-component :mainTitle="'Taleplere Verilen Yanıtlar'"></header-component>
    <div class="component-area-project">
      <TAccordion v-for="comp in companyNameList" :key="comp" class="panel-menu">
        <TAccordionTab>
          <template #header>
            <span style="color:black; margin-left: 20px;">{{ comp[0].reply.company }}</span>
          </template>
          <TAccordion v-for="compDetail in comp" :key="compDetail.id" style="margin: 10px 0;">
            <TAccordionTab>
              <template #header>
                <span style="color: black; margin-left:20px ;">{{ new
                  Date(compDetail.date.toDate()).toLocaleDateString("tr-TR") }}</span>
              </template>

              <div style="display: flex; margin: 10px 0;">
                <label>Talep Tarihi: </label>
                <span style="color:black;"> {{ new Date(compDetail.date.toDate()).toLocaleString("tr-TR") }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

              <div style="display: flex; margin: 10px 0;">
                <label>Proje Adı: </label>
                <span style="color:black;">{{ compDetail.reply.project }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

              <div style="display: flex; margin: 10px 0;">
                <label>Talep Tarih: </label>
                <span style="color:black;">{{ new Date(compDetail.reply.date.toDate()).toLocaleString("tr-TR") }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

              <div style="display: flex; margin: 10px 0;">
                <label>Talep Başlık: </label>
                <span style="color:black;">{{ compDetail.reply.title }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

              <div style="display: flex; margin: 10px 0;">
                <label>Talep Açıklama: </label>
                <span style="color:black;">{{ compDetail.reply.desc }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

              <div style="display: flex; margin: 10px 0;">
                <label style="color:red;">Talep Yanıtınız: </label>
                <span style="color:black;">{{ compDetail.desc }}</span>
              </div>
              <span style="width: 100%; border-top: 1px solid black;"></span>

            </TAccordionTab>
          </TAccordion>

        </TAccordionTab>
      </TAccordion>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { app } from '@/firebase/config';
export default {
  name: "ReplyView",
  components: { HeaderComponent },
  setup() {
    const firestore = getFirestore(app);
    const sendRequestList = ref([]);
    const companyNameList = ref([]);
    onMounted(() => {
      getData();
    });

    const getData = async () => {
      const q = query(collection(firestore, "sendRequests"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          sendRequestList.value.push(item.data());
        });
        const companyGroup = {};
        sendRequestList.value.forEach((data) => {
          const { companyName, ...myData } = data;

          if (companyName in companyGroup) {
            companyGroup[companyName].push(myData);
          } else {
            companyGroup[companyName] = [myData];
          }
        });
        companyNameList.value = companyGroup;
      });
    }
    return { companyNameList }
  }

}
</script>

<style scoped>
.panel-menu {
  width: 50%;
  margin: 10px 0;
}

label {
  color: black;
  font-weight: bold;
  margin-right: 4px;
}

span {
  display: flex;
  align-items: center;
  color: white;
}


@media only screen and (max-width: 700px) {
  .panel-menu {
    width: 100%;
  }
}
</style>