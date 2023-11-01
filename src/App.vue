<template>
  <div class="app-container">
    <div v-if="isLogged && stateNavbar">
      <menu-component :is-user="isUser"></menu-component>
    </div>
    <div class="componentArea">
      <nav-bar :is-login="isLogged" @closeMenu="closeSideMenu" :companyMail="companyMail"
        :companyName="companyName"></nav-bar>
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
  components: { MenuComponent, NavBar },
  setup() {
    const isLogged = ref(false);
    const isUser = ref(false);
    const auth = getAuth(app);
    const stateNavbar = ref(true);
    const companyName = ref(null);
    const companyMail = ref(null);
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          isLogged.value = true;
          companyName.value = user.displayName;
          companyMail.value = user.email;

          if (user.displayName !== null) {
            isUser.value = true;
          }
        }
      });
    });

    const closeSideMenu = (state) => {
      stateNavbar.value = state.value;
    }

    return { isLogged, isUser, closeSideMenu, stateNavbar, companyName, companyMail }
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
  height: 100vh;
}

.componentArea {
  width: 100%;
  height: 100vh;
  scroll-behavior: auto;
  overflow: auto;
}

.error-class {
  color: red;
  font-size: 12px;
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

.input-right-element {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  width: 50%;
}

.input-left-element {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  width: 50%;
}

.row-element {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
