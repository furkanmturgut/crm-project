<template>
    <div v-if="isSpinner !== true" class="loginArea">
        <img alt="Turkuvaz" class="iconStyle" src="@/assets/logo.png">
        <TInputText class="loginStyle" v-model="username" placeholder="Email"></TInputText>
        <TInputText v-model="password" type="password" class="loginStyle" placeholder="Parola"></TInputText>
        <TButton class="loginBtn" label="Giriş Yap" @click="login"></TButton>
    </div>
  <div style="display:flex; align-items:center; justify-content:center;" v-else>
    <TSpinner></TSpinner>
    <span style="display:flex; justify-content:center; align-items:center;">Yükleniyor...</span>
  </div>
    <TToast></TToast>
</template>

<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router'
export default {
    name: 'LoginView',
    setup() {
        const username = ref(null);
        const password = ref(null);
        const router = useRouter();
        const auth = getAuth(app);
        const toast = useToast();
        const isSpinner =ref(false)
        const login = () => {
            signInWithEmailAndPassword(auth, username.value, password.value).then(() => {
              isSpinner.value = true;
              setTimeout(() => {
                    router.push({ name: "HomeView" });
                    toast.add({
                        severity: 'success', summary: 'Bilgi', detail: 'Giriş İşlemi Başarılı', life: 1000
                    });
                }, 1100);
            }).catch(() => {
              isSpinner.value = false;
              toast.add({
                    severity: 'warn', summary: 'Bilgi', detail: 'Giriş Yapılamadı. Tekrar Deneyin', life: 1000
                });

            });
        }

        return { username, password, login,isSpinner }
    }

}
</script>

<style>
* {
    margin: 0;
}

.iconStyle {
    width: 120px;
    height: 120px;
}

.loginArea {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.loginStyle {
    width: 24%;
    margin: 14px 0;
}

.loginBtn {
    width: 24%;
    background-color: #1d9bf0;
}

@media (max-width:400px) {
    .loginStyle {
        width: 74%;
    }

    .loginBtn {
        width: 74%;
    }
}

@media (min-width:400px) and (max-width:800px) {
    .loginStyle {
        width: 60%;
    }

    .loginBtn {
        width: 40%;
    }
}
</style>
