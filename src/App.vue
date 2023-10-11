<template>
  <div class="app-container">
    <div v-if="isAdmin">
      <menu-component :is-user="isUser"></menu-component>
    </div>
    <div class="componentArea">
      <router-view></router-view>

    </div>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/firebase/config';
import { onMounted, ref } from 'vue';
export default {
  components: { MenuComponent },
  setup() {
    const isAdmin = ref(false);
    const isUser = ref(false);
    const auth = getAuth(app);
    onMounted(() => {
     
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isAdmin.value = true;
          if(user.displayName === "userCompany"){
            isUser.value = true;
          }
        }

      });
    });


    return { isAdmin ,isUser}
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300&display=swap');
* {
  margin: 0;
  font-family: 'Cairo', sans-serif;
}

.app-container {
  display: flex;
}

.componentArea{
  width: 86%;
}
</style>
