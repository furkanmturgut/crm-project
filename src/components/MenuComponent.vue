<template >
    <div class="menu" style="background-color: turquoise; height:100vh ; ">
        <div style="display: flex; align-items: center; justify-content: center; ">
            <img src="@/assets/logo.png" style="width:70px; height: 70px; margin: 20px 0;">
        </div>
        <ul>
            <li v-for="menuItem in menuItems" :key="menuItem.label" @click="toggleSubMenu(menuItem)"
                :style="{ backgroundColor: menuItem.active ? 'black' : 'initial' }">
                <i :class="menuItem.icons" @click="toggleSubMenu(menuItem)"></i>
                <a href="#">{{ menuItem.label }}</a>

                <ul v-if="menuItem.submenu && menuItem.active">
                    <li v-for="subItem in menuItem.submenu" :key="subItem.id">
                        <a href="#" @click="subSelected(subItem.id)">{{ subItem.label }}</a>
                    </li>
                </ul>
            </li>
        </ul>

    
    </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const menuItems = ref([
            { id: 1, label: 'Anasayfa', active: true, icons: 'pi pi-home' },
            {
                label: 'Müşteri Yönetimi', active: false, icons: 'pi pi-id-card', submenu: [
                    { id: 2, label: " -> Müşteriler" },
                    { id: 3, label: " -> Müşteri Talepleri" }
                ]
            },
            { id: 4, label: 'İletişim Yönetimi', active: false, icons: 'pi pi-envelope' },
            {
                label: 'Teklif Yönetimi', active: false, icons: 'pi pi-file', submenu: [
                    { id: 5, label: " -> Teklifler" },
                    { id: 6, label: " -> Hazır Teklif Listesi" }
                ]
            },
            {
                label: 'Görev ve Takvim Yönetimi', active: false, icons: 'pi pi-calendar', submenu: [
                    { id: 7, label: " -> Görev ve Takvim Planlama" },
                    { id: 8, label: " -> Hatırlatmalar ve bildirimler" }
                ]
            },
            { id: 9, label: 'Kullanıcı Yönetimi', active: false, icons: 'pi pi-user' },
            {id:10,label:'Çıkış Yap',active:false,icons:'pi pi-power-off'}

        ]);
        const router = useRouter();
        const isCurrentComponent = ref('');

        const toggleSubMenu = (selectedMenuItem) => {
            menuItems.value.forEach(menuItem => {
                menuItem.active = menuItem === selectedMenuItem;

            });
            if (selectedMenuItem.id == 4) {
                console.log("Selected ID")
                isCurrentComponent.value = "ContactView"
            }

            console.log("Clicked", selectedMenuItem)
        }

        const subSelected = (id) => {
            switch (id) {
                case 2:
                    router.push({ name: "CustomerView" })
                    break;

                case 4:

                    break;
            }
        }

        return { menuItems, toggleSubMenu, subSelected, isCurrentComponent }

    }

}
</script>

<style scoped>
.content-container {
  flex: 1;
  width: 86%;
  overflow: hidden;
}
i {
    color: white;
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
    margin-bottom: 5px;
    cursor: pointer;
}

ul ul {
    left: 100%;
    top: 0;
    background-color: black;
}


a {
    text-decoration: none;
    color: white;
    text-align: center;
}


li:hover>ul {
    display: block;
}
</style>