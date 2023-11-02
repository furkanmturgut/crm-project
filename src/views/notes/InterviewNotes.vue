<template>
    <div class="main-area">
        <header-component :mainTitle="'Görüşme Notları'" :btnTitle="'Görüşme Notu Ekle'" @btnClick="isDialog = true"></header-component>
        <interview-popup :closeDialog="closeDialog" v-if="isDialog"></interview-popup>
        <div class="component area-project">

        </div>
    </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import InterviewPopup from './InterviewPopup.vue';
import { ref } from 'vue';
export default {
    name: "OffersView",
    components: { HeaderComponent, InterviewPopup },
    setup() {
        const isDialog = ref(false);
        const closeDialog = () => {
            isDialog.value = false;
        }


        return {closeDialog,isDialog}
    }

}
</script>

<style scoped></style>