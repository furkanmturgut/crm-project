<template>
  <div class="app-container">
    <menu-component></menu-component>
    <router-view></router-view>
  </div>
</template>

<script>
import MenuComponent from './components/MenuComponent.vue'
export default {
  components: { MenuComponent },
  setup() {

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
</style>
