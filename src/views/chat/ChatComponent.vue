<template>
    <div class="chat-component">
        <div class="chat-header">
            <div style="display: flex; align-items: center;">
                <i class="pi pi-circle-fill" style="color:greenyellow;"></i>
                <small style="margin-left:10px; font-weight: bold; color:white;">Çevrimiçi</small>
            </div>
        </div>
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
            <TInputText placeholder="Mesaj gir..." class="input-style"></TInputText>
            <TButton class="btn-style" icon="pi pi-send"></TButton>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        selectedMessages: {
            type: Object,
            required: true
        },
        myId: {
            type: String,
            required: true
        }
    },
    name: "ChatComponent",
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
    width: 100%;
    height: 50px;
    background-color: darkmagenta;
}

.chat-header {
    background-color: gray;
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
    background-color: darkmagenta;
    margin-left: auto;
    margin-right: 20px;
    border-radius: 10px;
    color: white;
}

.my-right {
    width: 30%;
    height: max-content;
    padding: 10px;
    margin: 10px 0;
    background-color: darkmagenta;
    color: white;
    margin-left: 20px;
    margin-right: auto;
    border-radius: 10px;
}

.chat-component {
    width: 100%;
    scroll-behavior: auto;
    overflow: hidden;
    background-color: gray;
    border: 2px solid darkmagenta;
}

@media only screen and (max-width:700px) {
    .send-to-chat {
        display: flex;
        width: 80%;
        height: 50px;
        background-color: darkmagenta;
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