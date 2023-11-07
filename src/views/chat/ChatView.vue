<template>
    <div class="main-area">
        <header-component :mainTitle="'Mesajlar'"></header-component>
    </div>
    <new-chat-dialog :closeDialog="closeDialog" :isUser="isUser" v-if="isDialog"></new-chat-dialog>
    <div class="chat-view">
        <div class="message-list">
            <div class="chat-header">
                <span class="new-msg">Yeni Mesaj Oluştur</span>
                <PVButton class="btn-style" :label="'Yeni Mesaj'" @click="isDialog = true">
                </PVButton>
            </div>
            <div class="chat-list" v-for="(companyMessages, companyName) in messageList" :key="companyMessages.id">
                <div style="display: flex; align-items: center;" @click="startChat(companyMessages)">
                    <img src="../../../src/assets/favicon.png" style="height: 30px;">
                    <div style="display: flex; flex-direction: column; margin-left: 10px;">
                        <span class="company-name">{{ isUser ? 'ADMIN' : companyName }}</span>
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
import { getDatabase, ref as RDref, onValue, query, orderByValue } from 'firebase/database';
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
            console.log(auth.currentUser)
        }

        userControl();
        onMounted(() => {
            const mostViewedPosts = query(RDref(realtime, 'ADMIN/'), orderByValue("date"));
            onValue(mostViewedPosts, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    messageList.value = data;
                    if (auth.currentUser.displayName !== null) {
                        const filterMessage = Object.fromEntries(
                            Object.entries(messageList.value)
                                .filter(([companyName]) => companyName === auth.currentUser.displayName)
                        );
                        messageList.value = filterMessage;
                    } else {
                        messageList.value = data;
                    }
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

        return { closeDialog, isDialog, messageList, isUser, startChat, selectChat, selectedMessage, myId }
    }

}
</script>

<style scoped>
.new-msg {
    font-weight: bold;
    font-size: 18px;
}

.company-name {
    font-weight: bold;
}

.btn-style {
    width: 80%;
    margin-bottom: 10px;
}

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
    height: max-content;
    scroll-behavior: auto;
    overflow: auto;
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
    border-bottom: 2px solid turquoise;
}

@media only screen and (max-width: 700px) {
    .btn-style {
        width: 50%;
        height: 50px;
        font-size: 12px;
        display: flex;
        justify-content: center;
    }

    .company-name {
        font-weight: bold;
        font-size: 12px;
    }

}</style>