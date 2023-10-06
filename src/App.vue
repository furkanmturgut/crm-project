<template>
  <div class="app-container">
    <div v-if="isLogged">
      <menu-component></menu-component>
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
    const isLogged = ref(false);
    const auth = getAuth(app);
    onMounted(() => {
     
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLogged.value = true;          
        }
      });
    });


    return { isLogged }
  }
}
</script>

<style>
* {
  margin: 0px;
}

.app-container {
  display: flex;
}

.componentArea{
  width: 86%;
}
</style>
