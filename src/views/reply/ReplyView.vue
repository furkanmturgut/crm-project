<template>
  <div class="main-area">
    <header-component :mainTitle="'Taleplere Verilen Yanıtlar'"></header-component>
    <div class="component-area-project">
      <TAccordion v-for="comp in compName" :key="comp" class="panel-menu">
        <TAccordionTab>
          <template #header>
            <span style="color:black;">{{ comp }}</span>
          </template>
          <TAccordion v-for="demo in sendRequestList" :key="demo.id">
            <TAccordionTab>
              <template #header>
                <span style="color:black;" v-if="demo.reply.company ">{{ demo.desc }}</span>
              </template>
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
    const compName = ref(null);
    onMounted(() => {
      getData();
    });

    const getData = async () => {
      const q = query(collection(firestore, "sendRequests"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          sendRequestList.value.push(item.data());
          companyNameList.value.push(item.data().reply.company)
        });

        compName.value = [...new Set(Object.values(companyNameList.value))]
        console.log(compName.value);
      });
    }

    return { sendRequestList, compName }
  }

}
</script>

<style scoped>
.panel-menu {
  width: 50%;
}

span {
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: white;
}


@media only screen and (max-width: 700px) {
  .panel-menu {
    width: 100%;
  }
}
</style>