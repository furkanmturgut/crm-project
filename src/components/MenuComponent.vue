<template >
    <div style="background-color: turquoise; height:100vh; width: 200px ">
        <div style="display: flex; align-items: center; justify-content: center; ">
            <img alt="Turkuvaz" src="@/assets/logo.png" style="width:70px; height: 70px; margin: 20px 0;">
        </div>
        <div>
            <ul>
                <li v-for="items in itemsControl[0]" :key="items.id" @click="selectItem(items.id)"
                    :class="{ 'active': items.active }">
                    <i :class="items.icons"></i>
                    <a href="#"> {{ items.label }}</a>
                    <span v-if="items.notification " style="color: black; font-weight: bold;">
                        ({{ reqList.length }})
                    </span>
                </li>
            </ul>
        </div>
        <TConfirmDialog></TConfirmDialog>
    </div>
</template>

<script>

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useConfirm } from 'primevue/useconfirm';
import { getFirestore, collection, where, query, getDocs } from 'firebase/firestore';
export default {
    props: ["isUser"],
    setup(props) {
        const router = useRouter();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        const confirm = useConfirm();
        const menuItems = ref([
            { id: 1, label: 'Anasayfa', active: true, icons: 'pi pi-home', isUsers: true, isAdmins: true },
            { id: 2, label: 'Müşteri Yönetimi', active: false, icons: 'pi pi-id-card', isAdmins: true },
            { id: 12, label: 'Müşteri Talepleri', active: false, icons: 'pi pi-file-edit', isAdmins: true },
            { id: 3, label: 'İletişim Yönetimi', active: false, icons: 'pi pi-envelope', isAdmins: true },
            { id: 8, label: 'Teklif Yönetimi', active: false, icons: 'pi pi-file', isAdmins: true },
            { id: 4, label: 'Görev ve Takvim Yönetimi', active: false, icons: 'pi pi-calendar', isAdmins: true },
            { id: 5, label: 'Kullanıcı Yönetimi', active: false, icons: 'pi pi-user', isAdmins: true },
            { id: 6, label: 'Projeler & Ürünler', active: false, icons: 'pi pi-folder-open', isAdmins: true },
            { id: 9, label: 'Projelerim', active: false, icons: 'pi pi-folder-open', isUsers: true },
            { id: 10, label: 'Talep Oluştur', active: false, icons: 'pi pi-file-edit', isUsers: true },
            { id: 11, label: 'Bildirimler', active: false, icons: 'pi pi-inbox', notification: true, isUsers: true, isAdmins: true },
            { id: 7, label: 'Çıkış Yap', active: false, icons: 'pi pi-power-off', isAdmins: true, isUsers: true },

        ]);
        const itemsControl = ref([]);
        const reqList = ref([]);
        
        //Bildirim sayisi gostermek icin
        onMounted(async () => {
            const q = query(collection(firestore, "requests"), where("state", "==", false));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((doc) => {
                    reqList.value.push(doc.data());
                });
            });
        });

        if (props.isUser === false) {
            const a = menuItems.value.filter((item) => {
                return item.isAdmins == true;
            });
            itemsControl.value.push(a);
        } else if (props.isUser) {
            const a = menuItems.value.filter((item) => {
                return item.isUsers == true;
            });
            itemsControl.value.push(a);
        }

        const selectItem = (index) => {
            const selectMenu = menuItems.value.find(items => items.id == index);
            if (selectMenu) {
                menuItems.value.forEach(item => { item.active = false; })
                selectMenu.active = true;
                //Admin
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
                } else if (index == 6 || index == 9) {
                    router.push({ name: "ProjectView" })
                } else if (index == 7) {
                    confirmDialog();
                } else if (index == 12) {
                    router.push({ name: "AdminRequest" })
                }

                // User's
                if (index == 10) {
                    router.push({ name: "CreateRequestView" })
                } else if (index == 11) {
                    console.log("Bildirim")
                }
            }
        }
        const confirmDialog = () => {
            confirm.require({
                header: "Çıkış İşlemi",
                message: "Çıkış yapmak istediğinize emin misiniz ?",
                accept: () => {
                    signOut(auth).then(() => {
                        router.go({ name: "LoginView" })
                    });
                },
                acceptLabel: "Evet",
                reject: () => { },
                rejectLabel: "İptal"
            })
        }

        return { itemsControl, selectItem,reqList }

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
    background-color: white;
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