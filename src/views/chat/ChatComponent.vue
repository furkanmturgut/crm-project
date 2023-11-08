<template>
    <div class="chat-component">
        <div class="chat-header"></div>
        <div class="chat-area">
            <div v-for="(item) in selectedMessages" :key="item.id">
                <div class="my-to" v-if="item.myId === myId">
                    <span> {{ item.message }}</span>
                </div>
                <div class="my-right" v-else>
                    <span> {{ item.message }}</span>
                </div>
            </div>
        </div>

        <div class="send-to-chat">
            <TInputText placeholder="Mesaj gir..." v-model="messageText" class="input-style"></TInputText>
            <TButton class="btn-style" icon="pi pi-send" @click="sendMessage"></TButton>
        </div>

    </div>
</template>

<script>
import { getDatabase, set, ref as RDref } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { app } from "@/firebase/config";
import { ref } from 'vue';
import { uid } from 'uid';
export default {
    props: {
        selectedMessages: {
            type: Object,
            required: true
        },
        myId: {
            type: String,
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
    },
    name: "ChatComponent",
    setup(props) {
        const realtime = getDatabase(app);
        const auth = getAuth(app);
        const messageText = ref('');

        const sendMessage = () => {
            if (props.companyName) {
                set(RDref(realtime, "ADMIN/" + props.companyName + "/" + Date.now()), {
                    company: props.companyName,
                    myId: auth.currentUser.uid,
                    message: messageText.value,
                    msgId: uid(),
                    toUser: "USER",
                    date: Date.now()
                });
                messageText.value = "";
            }
        }

        return { messageText, sendMessage }
    }
}
</script>

<style scoped>
span {
    display: flex;
    justify-content: center;
}

.chat-area {
    height: 65vh;
    scroll-behavior: auto;
    overflow-y: auto;
}

.input-style {
    margin: 4px 20px;
    width: 50%;
}

.btn-style {
    width: 5%;
    margin: 4px 0;
    background-color: black;
    border: 1px solid black;
}

.send-to-chat {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 50px;
    background-color: turquoise;
}

.chat-header {
    background-image: url("../../assets/favicon.png");
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.my-to {
    width: 30%;
    height: max-content;
    padding: 10px;
    margin: 10px 0;
    background-color: #e7effa;
    margin-left: auto;
    margin-right: 20px;
    border-radius: 10px;
    color: black;
    font-weight: bold;
}

.my-right {
    width: 30%;
    height: max-content;
    padding: 10px;
    margin: 10px 0;
    background-color: #bdd3f1;
    color: black;
    font-weight: bold;
    margin-left: 20px;
    margin-right: auto;
    border-radius: 10px;
}

.chat-component {
    width: 100%;
    scroll-behavior: auto;
    overflow: hidden;
    background-image: url("../../assets/favicon.png");
    border: 2px solid turquoise;
}

@media only screen and (max-width:700px) {
    .send-to-chat {
        display: flex;
        width: 80%;
        height: 50px;
        background-color: turquoise;
        position: fixed;
        bottom: 0;
    }

    .input-style {
        margin: 4px 20px;
        width: 50%;
    }

    .btn-style {
        width: 50px;
        margin: 4px 0;
        background-color: black;
        border: 1px solid black;
    }

    .my-to {
        width: 40%;
        height: max-content;
    }

    .my-right {
        width: 40%;
        height: max-content;
    }
}
</style>