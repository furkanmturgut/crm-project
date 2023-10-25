<template>
    <h1 style="margin-top: 20px;">{{ mainTitle }}</h1>
    <div class="btn-history-request" v-if="btnTitle !== null && !isUser">
        <span class="btn-name" @click="btnClick">{{ btnTitle }}</span>
    </div>

</template>

<script>
export default {
    name:"HeaderComponent",
    props: {
        mainTitle: {
            type: String,
            required: true,
            default: ""
        },
        btnTitle: {
            type: String,
            required: false,
            default: null
        },
        isUser: {
            type: Boolean,
            required: true,
            
        }
    },
    emits:["btnClick"],
    setup(props, {emit}){
        const btnClick = () => {
            emit("btnClick")
        }

        return {btnClick}
    }

}
</script>

<style scoped>
.btn-history-request {
    width: 26%;
    height: 64px;
    background-color: turquoise;
    margin: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}

.btn-name {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    text-align: center;
}
</style>