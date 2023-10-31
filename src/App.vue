<template>
  <div class="app-container">
    <div v-if="isLogged && stateNavbar" >
      <menu-component :is-user="isUser"></menu-component>
    </div>
    <div class="componentArea">
      <nav-bar :is-login="isLogged" @closeMenu="closeSideMenu"></nav-bar>
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
    const isLogged = ref(false);
    const isUser = ref(false);
    const auth = getAuth(app);
    const stateNavbar = ref(true);
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLogged.value = true;

          if (user.displayName !== null) {
            isUser.value = true;
          }
        }
      });
    });

    const closeSideMenu = (state) => {
      stateNavbar.value = state.value;
    }

    return { isLogged, isUser, closeSideMenu, stateNavbar }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300&display=swap');

* {
  margin: 0;
  font-family: 'Cairo', sans-serif;
  box-sizing: border-box;
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
}

.component-area-project {
  width: 100%;
  height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

@media only screen and (max-width: 700px) {
  .component-area-project {
    width: 80%;
    display: inline-block;
}
}

</style>
