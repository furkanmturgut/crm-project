<template>
  <h1>HomeView {{ compName }} </h1>
</template>

<script>
import {app} from '@/firebase/config';
import { getAuth } from 'firebase/auth';
import {ref} from 'vue';
export default {
  name: "HomeView",
  setup() {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const compName = ref(null)
    if(user !== null){
      compName.value = user.displayName;
    }

    return {compName}
  }


}
</script>

<style scoped></style>