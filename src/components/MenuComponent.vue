<template >
    <div class="container">
        <div>
            <div class="menu">
                <div style="display: flex; align-items: center; justify-content: center; ">
                    <img alt="Turkuvaz" src="@/assets/favicon.png" style="width:50px; height: 50px; margin: 20px  0;">
                </div>
                <div>
                    <ul>
                        <li v-for="items in itemsControl[0]" :key="items.id" @click="selectItem(items.id)"
                            :class="{ 'active': items.active }">
                            <i :class="items.icons"></i>
                            <a href="#"> {{ items.label }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
export default {
    props: {
        isUser: {
            type: Boolean,
            required: true
        }
    },
    setup(props) {
        const router = useRouter();
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

        ]);
        const itemsControl = ref([]);

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
                    router.push({ name: "HomeView" });
                } else if (index == 2) {
                    router.push({ name: "CustomerView" });
                } else if (index == 3) {
                    console.log("İletişim");
                } else if (index == 8) {
                    router.push({ name: "OffersView" });
                } else if (index == 5) {
                    console.log("Görev")
                } else if (index == 6 || index == 9) {
                    router.push({ name: "ProjectView" })
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

        return { itemsControl, selectItem }

    }

}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: flex-start;
}

.menu {
    background-color: turquoise;
    height: 100vh;
    width: 200px;
}

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
    margin: 4px;
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

@media only screen and (max-width:600px) {
    .menu {
        background-color: turquoise;
        height: 100vh;
        width: 100px;
    }
}
</style>