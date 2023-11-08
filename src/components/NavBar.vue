<template>
    <div class="navbar" id="navbar" v-if="isLogin">
        <div style="display: flex; align-items: center; color: white; margin-left: 10px;">
            <i class="pi pi-align-justify" style="cursor: pointer; " @click="openSideMenu"></i>
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
    <TConfirm></TConfirm>
    <TMenu ref="op" id="profile_menu" :model="profileItem" :popup="true" style="margin-top:10px;">
        <template #start>
            <div style="display: flex; align-items: center; padding-left: 4px;">
                <img src="../assets/favicon.png" style="width: 20px; height: 20px;" />
                <div style="display: flex; flex-direction: column; width: 100%; margin-left: 10px;">
                    <span>{{ companyName === null ? 'ADMIN' : companyName }}</span>
                    <span style="width: 100%; border-top: 1px solid black;"></span>
                    <span>{{ companyMail }}</span>
                </div>
            </div>
        </template>

        <template #item="{ props, label }">
            <div class="overlayMenu">
                <span style="margin-right: 6px;" v-bind="props.icon"></span>
                <span>{{ label }}</span>
            </div>
        </template>
    </TMenu>
    <user-profile :closeDialog="closeDialog" v-if="isDialog"></user-profile>
    <TMenu ref="opNot" id="not_menu" :model="notificationItem" :popup="true" style="margin-top:10px;">
        <template #item="{ props, label }">
            <div class="overlayMenu">
                <span style="margin-right: 6px;" v-bind="props.icon"></span>
                <span>{{ label }}</span>
            </div>
        </template>
    </TMenu>
</template>

<script>
import { useConfirm } from 'primevue/useconfirm';
import UserProfile from '@/views/UserProfile.vue';
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { ref, onMounted, computed } from 'vue'
import { app } from '@/firebase/config';
import { getFirestore, query, collection, where, onSnapshot } from 'firebase/firestore';
export default {
    props: {
        isLogin: {
            type: Boolean,
            required: true,
            default: true
        },
        companyName: {
            type: String,
            required: true,
        },
        companyMail: {
            required: true,
            type: String
        }
    },
    components:{UserProfile},
    setup(props, { emit }) {
        const isDialog = ref(false);
        const router = useRouter();
        const op = ref();
        const opNot = ref();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        const confirm = useConfirm();
        const sideMenu = ref(true);
        const data = ref([]);
        const notificationItem = ref([]);
        const profileItem = ref([
            { label: 'Profil', icon: 'pi pi-user', command: () => userProfle() },
            { label: 'Görüşme Talepleri', icon: 'pi pi-hourglass' },
            { separator: true },
            { label: 'Çıkış Yap', icon: 'pi pi-power-off', command: () => confirmDialog() }
        ]);

        const openSideMenu = () => {
            sideMenu.value = !sideMenu.value;
            emit("closeMenu", sideMenu);
        }

        onMounted(async () => {
            // Notification size
            const q = query(collection(firestore, "requests"), where("state", "==", false));
            onSnapshot(q, (snapshot) => {
                data.value = [];
                snapshot.forEach((item) => {
                    data.value.push(item.data());
                });

                if (props.companyName !== null) {
                    const filteredData = data.value.filter((item) => {
                        return item.company === props.companyName
                    });

                    data.value = [];
                    data.value = filteredData;
                    notificationItem.value = [];
                    notificationItem.value.push(
                    { icon: 'pi pi-info-circle', label: data.value.length + ' adet bekleyen talebiniz var.' },
                    { icon: 'pi pi-hourglass', label: 3 + ' adet bekleyen görüşme var.' },
                );
                }else if(props.companyName === null) {
                    const filteredData = data.value.filter((item) => {
                        return item.state === false;
                    });
                    data.value = [];
                    data.value = filteredData;
                    notificationItem.value = [];
                    notificationItem.value.push(
                    { icon: 'pi pi-info-circle', label: data.value.length + ' adet bekleyen talebiniz var.' },
                    { icon: 'pi pi-hourglass', label: 3 + ' adet bekleyen görüşme var.' },
                );
                }
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

        const userProfle = () => {
            isDialog.value = true;
        }

        const closeDialog = () => {
            isDialog.value = false;
        }
        const clickNotification = () => {
            router.push({ name: "AdminRequest" })
        }

        return { openMenu, profileItem, op, opNot, notificationLength, openNotification, notificationItem, clickNotification, openSideMenu ,isDialog,closeDialog}
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

.pi-align-justify:hover {
    color: turquoise;
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