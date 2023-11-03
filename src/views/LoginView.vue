<template>
    <div v-if="isSpinner !== true">
        <form @submit.prevent="onSubmit" class="loginArea">
            <img alt="Turkuvaz" class="iconStyle" src="@/assets/logo.png">
            <TInputText type="email" v-bind="email" class="loginStyle" placeholder="Mail adresi giriniz" />
            <span class="error-class">{{ errors.email }}</span>
            <TInputText type="password" v-bind="password" class="loginStyle" placeholder="Parola giriniz" />
            <span class="error-class">{{ errors.password }}</span>
            <TButton class="loginBtn" label="Giriş Yap" type="submit"></TButton>
        </form>
    </div>
    <div style="display:flex; align-items:center; justify-content:center;" v-else>
        <TSpinner></TSpinner>
        <span style="display:flex; justify-content:center; align-items:center;">Yükleniyor...</span>
    </div>
    <TToast></TToast>
</template>
  
<script >
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useRouter } from 'vue-router';
import { toastError, toastSuccess } from '@/components/Base/toast';
import { ref } from 'vue';

export default {
    setup() {
        const router = useRouter();
        const auth = getAuth(app);
        const isSpinner = ref(false);

        const { errors, handleSubmit, defineInputBinds } = useForm({
            validationSchema: yup.object({
                email: yup.string().email("Geçerli bir email adresi giriniz").required("Mail alanı boş bırakılamaz"),
                password: yup.string().min(6, "En az 6 karakter olan parola giriniz").required("Parola alanı boş bırakılamaz"),
            }),
        });

        const email = defineInputBinds('email');
        const password = defineInputBinds('password');
        const onSubmit = handleSubmit(() => {
            signInWithEmailAndPassword(auth, email.value.value, password.value.value).then(() => {
                isSpinner.value = true;
                setTimeout(() => {
                    router.push({ name: "HomeView" });
                    toastSuccess("Giriş İşlemi Başarılı");
                }, 1100);
            }).catch((error) => {
                isSpinner.value = false;
                console.log(error);
                toastError("Giriş Yapılamadı.");
            });
        });

        return { email, password, onSubmit, errors, isSpinner }
    }
}
</script>

<style>
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
    margin: 8px 0;
}

.loginBtn {
    width: 24%;
    margin-top: 8px;
    background-color: #1d9bf0;
}

@media only screen and (max-width:800px) {
    .loginStyle {
        width: 60%;
    }

    .loginBtn {
        width: 40%;
    }
}
</style>
