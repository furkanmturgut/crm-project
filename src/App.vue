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

<style></style>
