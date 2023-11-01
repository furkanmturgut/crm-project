<template>
    <div class="offer-area">
        <header-component :mainTitle="'Teklifler'" :btnTitle="'Teklif Gönder'"
            @btnClick="isDialog = true"></header-component>
        <interview-popup :closeDialog="closeDialog" v-if="isDialog"></interview-popup>
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
import { onMounted, ref } from 'vue';
import { getFirestore, query, collection, getDocs, orderBy } from "firebase/firestore";
import { app } from '@/firebase/config.js';
import HeaderComponent from '@/components/HeaderComponent.vue';
import InterviewPopup from './InterviewPopup.vue';
export default {
    name: "OffersView",
    components: { HeaderComponent, InterviewPopup },
    setup() {
        const mailList = ref([]);
        const firestore = getFirestore(app);
        const isDialog = ref(false);

        const closeDialog = (onSuccess) => {
            if (onSuccess === true) {
                mailList.value = [];
                getData();
                isDialog.value = false;
            }
            isDialog.value = false;
        }

        onMounted(() => {
            getData();
        });

        const getData = async () => {
            const q = query(collection(firestore, "mailList"), orderBy("mailDate", "desc"));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((item) => {
                    mailList.value.push(item.data());
                })
            });
        }

        return { mailList, isDialog, closeDialog }
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

</style>