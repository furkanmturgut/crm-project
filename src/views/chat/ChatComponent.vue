<template>
    <div class="chat-component">
        <div class="chat-header">
            <div style="display: flex; align-items: center;">
                <i class="pi pi-circle-fill" style="color:green;"></i>
                <small style="margin-left:10px; font-weight: bold; color:green;">Çevrimiçi</small>
            </div>
        </div>
        <div style="width: 100%;" v-for="(item, key) in selectedMessages" :key="key">
            <div class="my-to" :style="{ marginLeft: item.myId === myId ? 'auto' : '20px' }">
                <span> {{ item.message }}</span>
            </div>
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
    }

}
</script>

<style scoped>
.chat-header {
    background-color: turquoise;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.my-to {
    width: 30%;
    height: max-content;
    padding: 10px;
    margin-top: 20px;
    background-color: aqua;
    margin-left: 20px;
    margin-right: auto;
    border-radius: 10px;
}

.chat-component {
    width: 100%;
    height: 80vh;
    background-color: chartreuse;
}
</style>