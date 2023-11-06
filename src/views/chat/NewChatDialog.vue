<template>
    <PVDialog :btnLabel="'Gönder'" :closeDialog="closeDialog" @onSubmit="sendChat"
        :style="isUser ? 'width:30vw; height:35vh;' : 'width:30vw; height:60vh;'">
        <template #dialogForm>
            <form @submit.prevent="sendChat">
                <div class="add-area">
                    <div style="display: flex; flex-direction: column;" v-if="!isUser">
                        <label>Firma Seçiniz</label>
                        <TDropdown v-model="selectCompany" :options="customerList" optionLabel="compName"></TDropdown>
                    </div>
                    <label>Mesaj</label>
                    <TextArea autoResize rows="3" cols="30" v-model="textMsg"></TextArea>
                </div>
            </form>
        </template>
    </PVDialog>
    <TToast></TToast>
</template>

<script>
import PVDialog from '@/components/PVDialog.vue';
import { app } from "@/firebase/config";
import { getFirestore, query, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { getDatabase, ref as RDref, set } from "firebase/database";
import { ref } from "vue";
import { uid } from 'uid';
import { toastError, toastSuccess } from '@/components/Base/toast';
import { getAuth } from 'firebase/auth';
export default {
    name: "ChatDialog",
    components: { PVDialog },
    props: {
        closeDialog: {
            type: Function,
            reqired: true
        },
        isUser: {
            type: Boolean,
            required: true
        }
    },
    setup(props) {
        const firestore = getFirestore(app);
        const realtime = getDatabase(app);
        const auth = getAuth(app);
        const customerList = ref([]);
        const textMsg = ref(null);
        const selectCompany = ref(null)
        const getCustomerList = async () => {
            const q = query(collection(firestore, "customers"));
            await getDocs(q).then((payload) => {
                payload.forEach((item) => {
                    customerList.value.push(item.data());
                });
            });
        }
        getCustomerList();

        const sendChat = () => {
            // Admin
            if (props.isUser) {
                set(RDref(realtime, "ADMIN"+"/"+ auth.currentUser.displayName+ "/" + uid()), {
                    company: auth.currentUser.displayName,
                    myId: auth.currentUser.uid,
                    toUser:"ADMIN",
                    message: textMsg.value,
                    msgId: uid(),
                    date: serverTimestamp()
                }).then(() => {
                    toastSuccess("Mesaj Gönderildi")
                }).catch(() => {
                    toastError("Mesaj Gönderilemedi!")
                });
            } else {
                set(RDref(realtime, "ADMIN"+"/"+ selectCompany.value.compName+ "/" + uid()), {
                    company: selectCompany.value.compName,
                    myId: auth.currentUser.uid,
                    message: textMsg.value,
                    msgId: uid(),
                    toUser:"USER",
                    date: serverTimestamp()
                }).then(() => {
                    toastSuccess("Mesaj Gönderildi")
                }).catch(() => {
                    toastError("Mesaj Gönderilemedi!")
                });
            }
        }

        return { customerList, selectCompany, textMsg, sendChat }
    }

}
</script>

<style scoped>
.add-area {
    display: flex;
    flex-direction: column;
}

label {
    color: black;
    font-weight: bold;
    margin: 10px 0;
}
</style>