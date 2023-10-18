<template>
    <div class="offer-area">
        <h1 style="margin-top:20px;">Teklifler</h1>

        <div class="btn-add-offer">
            <TDynamicDialog></TDynamicDialog>
            <span class="btn-name" @click="newOffer">Teklif Gönder</span>
        </div>
        <span style="font-weight: bold; font-size: 22px; margin:20px 0;">Gönderilmiş Mailler</span>
        <TAccordion style="width: 60%; margin: 8px 0;" v-for="mail in mailList" :key="mail.mailDate">
            <TAccordionTab>
                <template #header>
                    <i class="pi pi-envelope" style="margin:0 6px;"></i>
                    <span>{{ mail.send }}</span>
                </template>
                <div>
                    <i class="pi pi-user" style="margin:0 6px"></i>
                    <span style="font-weight: bold;">Kime : <span style="cursor: pointer;">{{ mail.send }}</span></span>
                </div>

                <div>
                    <i class="pi pi-flag" style="margin:0 6px"></i>
                    <span style="font-weight: bold;">Başlık : <span>{{ mail.title }}</span></span>
                </div>
                <i class="pi pi-file" style="margin:0 6px"></i>
                <span style="font-weight: bold;">Açıklama : </span>
                <p style="margin: 0 6px;">{{ mail.content }}</p>
            </TAccordionTab>
        </TAccordion>
    </div>
</template>

<script>
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs,orderBy } from "firebase/firestore";
import { app } from '@/firebase/config.js';
export default {
    name: "OffersView",
    setup() {
        const dialog = useDialog();
        const mailList = ref([]);
        const firestore = getFirestore(app);

        const NewOffer = defineAsyncComponent(() => import('@/views/offers/NewOfferPopup.vue'));
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

        onMounted(async () => {
            const q = query(collection(firestore, "mailList"),orderBy("mailDate","desc"));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((item) => {
                    mailList.value.push(item.data());
                })
            });
        })

        return { newOffer,mailList }
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