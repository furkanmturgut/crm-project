<template>
  <div class="app-container">
    <div v-if="isAdmin">
      <menu-component :is-user="isUser"></menu-component>
    </div>
    <div class="componentArea">
      <nav-bar :is-user="isAdmin"></nav-bar>
      <router-view></router-view>

    </div>
  </div>

  <TConfirmDialog></TConfirmDialog>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/firebase/config';
import { onMounted, ref } from 'vue';
import NavBar from './components/NavBar.vue';
export default {
  components: { MenuComponent,NavBar },
  setup() {
    const isAdmin = ref(false);
    const isUser = ref(false);
    const auth = getAuth(app);
 
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isAdmin.value = true;

          if (user.displayName !== null) {
            isUser.value = true;
          }
        }
      });
    });

    return { isAdmin, isUser }
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
  width: 100%;
}

.componentArea {
  width: 100%;
}

.error-class {
  color: red;
  font-weight: bold;
}</style>
