<template>
    <div class="navbar" v-if="isUser">
        <div style="display: flex; align-items: center; color: white; margin-left: 10px;">
            <i class="pi pi-align-justify"></i>
        </div>
        <div
            style="display: flex;  align-items: center; justify-content: flex-end; height: 100%; width: max-content; margin-left: auto;">
            <i class="pi pi-bell" style="color: white; cursor: pointer;" v-tooltip.bottom="'Bildirimler'"
                @click="openNotification" aria-haspopup="true" aria-controls="not_menu"></i>
            <span class="notificationSize">
                {{ notificationLength }}
            </span>
            <i class="pi pi-user" style="color: white; margin: 0 40px; cursor: pointer;" aria-haspopup="true"
                aria-controls="profile_menu" @click="openMenu" v-tooltip.bottom="'Hesap'"></i>
        </div>
    </div>
    <TMenu ref="op" id="profile_menu" :model="profileItem" :popup="true" style="margin-top:10px;">
        <template #item="{ props, label }">
            <div class="overlayMenu">
                <span style="margin-right: 6px;" v-bind="props.icon"></span>
                <span>{{ label }}</span>
            </div>
        </template>
    </TMenu>

    <TMenu ref="opNot" id="not_menu" :model="notificationItem" :popup="true" style="margin-top:10px;">
        <template #item="{ props }">
            <div class="notMenu">
                <span style="margin-right: 6px;" v-bind="props.icon"></span>
                <span>Toplamda <b style="text-decoration: underline;" v-tooltip.bottom="'Git'" @click="clickNotification">{{
                    notificationLength }}
                        adet</b> çözülmemiş talep ve <b v-tooltip.bottom="'Git'" style="text-decoration: underline;">68
                        adet</b> görüşme talebi bulunmaktadır.</span>
            </div>
        </template>
    </TMenu>
</template>

<script>
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { ref, onMounted, computed } from 'vue'
import { app } from '@/firebase/config';
import { getFirestore, query, collection, where, onSnapshot } from 'firebase/firestore';
export default {
    props: {
        isUser: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    setup() {
        const router = useRouter();
        const op = ref();
        const opNot = ref();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        const confirm = useConfirm();
        const data = ref([]);
        const notificationItem = ref([
            { icon: 'pi pi-info-circle' },
        ]);
        const profileItem = ref([
            { label: 'Profil', icon: 'pi pi-user' },
            { label: 'Görüşme Talepleri', icon: 'pi pi-hourglass' },
            { separator: true },
            { label: 'Çıkış Yap', icon: 'pi pi-power-off', command: () => confirmDialog() }
        ]);

        onMounted(async () => {
            const q = query(collection(firestore, "requests"), where("state", "==", false));
            onSnapshot(q, (snapshot) => {
                data.value = [];
                snapshot.forEach((item) => {
                    data.value.push(item.data());
                });
            });
        });

        const notificationLength = computed(() => {
            return data.value.length;
        });

        // openOverlayMenu
        const openMenu = (event) => { op.value.toggle(event); }

        const openNotification = (event) => { opNot.value.toggle(event); }

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
            });
        }
        const clickNotification = () => {
            router.push({ name: "AdminRequest" })
        }

        return { openMenu, profileItem, op, opNot, notificationLength, openNotification, notificationItem, clickNotification }
    }
}
</script>

<style scoped>
.navbar {
    height: 40px;
    width: 100%;
    background-color: #746f6f;
    display: flex;

}

.notificationSize {
    color: black;
    background-color: turquoise;
    height: 16px;
    width: 16px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -14px;
    margin-left: -7px;
}

.overlayMenu {
    color: #746f6f;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 6px 8px;
}

.notMenu {
    color: #746f6f;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 6px 8px;
    height: 20%;
}

.overlayMenu:hover {
    color: black;
}
</style>