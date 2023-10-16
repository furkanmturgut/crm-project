<template>
  <div class="app-container">
    <div v-if="isAdmin" class="sticky-menu">
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
  width: 86%;
}

.sticky-menu {
  position: sticky;
  top: 0;
  background-color: #fff;
  /* Add a background color if needed */
  z-index: 100;
  /* Adjust the z-index as needed */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  /* Add a box shadow if desired */
}</style>
