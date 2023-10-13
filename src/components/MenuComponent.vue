<template >
    <div style="background-color: turquoise; height:100vh; width: 200px ">
        <div style="display: flex; align-items: center; justify-content: center; ">
            <img alt="Turkuvaz" src="@/assets/logo.png" style="width:70px; height: 70px; margin: 20px 0;">
        </div>
        <div>
            <ul>
                <li v-for="items in menuList" :key="items" @click="selectItem(items.id)"
                    :class="[items.active == true ? 'active' : '']">
                    <i :class="items.icons"></i>
                    <a href="#"> {{ items.label }}</a>
                </li>
            </ul>
        </div>
        <TConfirmDialog></TConfirmDialog>
        <TToast></TToast>

    </div>
</template>

<script>

import { ref } from 'vue';
import menuItems from "@/constData/menuItems";
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useConfirm } from 'primevue/useconfirm'
export default {
    props: ["isUser"],
    setup() {
        const menuList = ref(menuItems);
        const router = useRouter();
        const auth = getAuth(app);
        const confirm = useConfirm();
        const selectItem = (index) => {
            const selectMenu = menuItems.find(items => items.id == index);
            if (selectMenu) {
                selectMenu.active = !selectMenu.active;
                console.log("Active : ",menuItems);
            }
            if (index === 1) {
                router.push({ name: "HomeView" })
            } else if (index == 2) {
                router.push({ name: "CustomerView" })
            } else if (index == 3) {
                console.log("İletişim")
            } else if (index == 8) {
                router.push({ name: "OffersView" })

            } else if (index == 5) {
                console.log("Görev")
            } else if (index == 6) {
                router.push({ name: "ProjectView" })

            } else if (index == 7) {
                confirmDialog();
            }
        }

        const confirmDialog = () => {
            confirm.require({
                header: "Çıkış İşlemi",
                message: "Çıkış yapmak istediğinize emin misiniz ?",
                accept: () => {
                    signOut(auth).then(() => {
                        router.go({ name: "LoginView" })
                    })

                },
                acceptLabel: "Evet",
                reject: () => { },
                rejectLabel: "İptal"
            })
        }

        return { menuList, selectItem }

    }

}
</script>

<style scoped>
i {
    color: black;
    margin: 8px;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    position: relative;
    padding: 10px;
    margin: 10px 4px;
    cursor: pointer;

}

.active {
    background-color: brown;
}


a {
    text-decoration: none;
    color: black;
    font-weight: bold;
    text-align: center;
}


li:hover {
    display: block;
    background-color: rgb(255, 255, 255, 0.8);
}
</style>