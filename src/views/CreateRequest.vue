<template>
    <div class="request-area">
        <header-component :mainTitle="'Taleplerim'" :btnTitle="'Geçmiş Talepleri Listele'"
            @btnClick="historyRequest"></header-component>
    </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue"
export default {
    name: "CreateRequest",
    components: {
        HeaderComponent
    },
    setup() {
        const historyRequest = () => {

        }

        return { historyRequest }
    }
}

</script>

<style scoped>
.request-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>