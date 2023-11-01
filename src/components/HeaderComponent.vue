<template>
    <h1 style="margin: 20px 0;">{{ mainTitle }}</h1>
    <PVButton :label="btnTitle" class="btn-bg" v-if="btnTitle !== null && !isUser" @click="btnClick"></PVButton>
</template>

<script>
import PVButton from './PVButton.vue';
export default {
    name: "HeaderComponent",
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
    components: { PVButton },
    setup(props, { emit }) {
        const btnClick = () => {
            emit("btnClick");
        }

        return { btnClick }
    }

}
</script>

<style scoped>
.btn-bg {
    width: 20%;
    height: 58px;
    background-color: turquoise;
    border: 1px solid turquoise;
    margin: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
}

@media only screen and (max-width: 700px) {
    .btn-bg {
        width: 40%;
    }
}
</style>