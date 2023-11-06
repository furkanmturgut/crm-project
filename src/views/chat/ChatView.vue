<template>
    <div class="main-area">
        <header-component :mainTitle="'Mesajlar'"></header-component>
    </div>
    <new-chat-dialog :closeDialog="closeDialog" :isUser="isUser" v-if="isDialog"></new-chat-dialog>
    <div class="chat-view">
        <div class="message-list">
            <div class="chat-header">
                <span style="font-weight:bold; font-size: 18px; ">Yeni Mesaj Oluştur</span>
                <PVButton style=" width:80% ; margin-bottom: 10px; " :label="'Yeni Mesaj'" @click="isDialog = true">
                </PVButton>
            </div>
            <div class="chat-list" v-for="(companyMessages, companyName) in messageList" :key="companyMessages.id">
                <div style="display: flex; align-items: center;" @click="startChat(companyMessages)">
                    <img src="../../../src/assets/favicon.png" style="height: 30px;">
                    <div style="display: flex; flex-direction: column; margin-left: 10px;">
                        <span style="font-weight: bold;">{{ isUser ? 'ADMIN' : companyName }}</span>
                        <span>{{ companyMessages[Object.keys(companyMessages)[0]].message }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="chat-area" v-if="selectChat">
            <chat-component :selectedMessages="selectedMessage" :myId="myId"></chat-component>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import NewChatDialog from './NewChatDialog.vue';
import PVButton from '@/components/PVButton.vue';
import { ref, onMounted } from 'vue';
import { getDatabase, ref as RDref, onValue} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from "@/firebase/config";
import ChatComponent from './ChatComponent.vue';
export default {
    name: "ChatView",
    components: { HeaderComponent, NewChatDialog, PVButton, ChatComponent },
    setup() {
        const realtime = getDatabase(app);
        const auth = getAuth(app);
        const messageList = ref([]);
        const isUser = ref(false);
        const myId = ref(auth.currentUser.uid);
        const userControl = () => {
            if (auth.currentUser.displayName !== null) {
                isUser.value = true;
            }
        }

        userControl();
        onMounted(() => {
            const messageRef = RDref(realtime, 'ADMIN/');
            onValue(messageRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    messageList.value = data;
                }
            });
        });

        const isDialog = ref(false);
        const closeDialog = () => {
            isDialog.value = false;
        }
        const selectChat = ref(false);
        const selectedMessage = ref([]);
        const startChat = (companyMessages) => {
            selectChat.value = !selectChat.value;
            selectedMessage.value = companyMessages;
        }

        return { closeDialog, isDialog, messageList, isUser, startChat, selectChat, selectedMessage,myId }
    }

}
</script>

<style scoped>
.chat-view {
    display: flex;
    flex-direction: row;
}

.message-list {
    width: 30%;
    flex-direction: column;
}

.chat-area {
    width: 70%;
}

.chat-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #E5E7E9;
}

.chat-list {
    border: 1px solid black;
}
</style>