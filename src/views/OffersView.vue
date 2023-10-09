<template>
    <div class="offer-area">
        <h1 style="margin-top:20px;">Teklifler</h1>

        <div class="btn-add-offer">
            <TDynamicDialog></TDynamicDialog>
            <span class="btn-name" @click="newOffer">Teklif Gönder</span>
        </div>
    </div>
</template>

<script>
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent } from 'vue';
export default {
    name: "OffersView",
    setup() {
        const dialog = useDialog();
        const NewOffer = defineAsyncComponent(() => import('@/views/popup/NewOfferPopup.vue'));
        const newOffer = () => {
            dialog.open(NewOffer, {
                props: {
                    header: "Yeni Teklif Oluştur",
                    style: {
                        width: '450px'
                    },
                    modal: true
                }
            });
        }


        return { newOffer }
    }

}
</script>

<style scoped>
.offer-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.btn-add-offer {
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