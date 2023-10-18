<template>
  <div class="project-list">
      <header-component :mainTitle="'Projeler & Ürünler'" :btnTitle="'Proje Ekle'" @btnClick="addProject"></header-component>
      <TDynamicDialog></TDynamicDialog>
      <span style="font-weight: bold; margin:20px 0;  font-size: 22px;">Tüm Projeler</span>
      <div class="customer-btn-area" v-if="projectList.length !==0">
        <project-component :projectList="projectList" :isUser="isUser" :compName="compName"></project-component>
      </div>

    </div>
</template>

<script>
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useDialog } from 'primevue/usedialog';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import ProjectComponent from '@/components/ProjectComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { app } from '@/firebase/config';
import { getAuth } from 'firebase/auth';

export default {
  name: 'ProjectView',
  components: { ProjectComponent,HeaderComponent },
  setup() {
    const dialog = useDialog();
    const projectList = ref([]);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    const user = auth.currentUser;
    const compName = ref(null);
    const isUser = ref(false);
    const ProjectPopup = defineAsyncComponent(() => import("@/views/project/ProjectPopup.vue"))
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
      if (user !== null) {
        compName.value = user.displayName;
        if (user.displayName !== null) {
          isUser.value = true;
        }
      }

      const q = query(collection(firestore, "projects"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          projectList.value.push(item.data());
        });
      })
    })

    return { addProject, projectList, compName, isUser }

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