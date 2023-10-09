<template>
    <form @submit.prevent="sendToOffer">
        <div class="offer-area">
            <label>Mail atılacak firmayı arayın</label>
            <TAutoComplete  v-model="searchCompany" :suggestions="items" @complete="search"></TAutoComplete>

            <label>Gönderilecek Email</label>
            <TInputText placeholder="Email" v-model="sendMail"></TInputText>

            <label>Konu Başlığı</label>
            <TInputText placeholder="Başlık" v-model="sendTitle"></TInputText>

            <label>Konu İçeriği</label>
            <TInputText placeholder="İçerik" v-model="sendContent"></TInputText>

            <label>PDF Dosyası</label>
            <TFileUpload mode="basic" chooseLabel="Yükle" accept="application/pdf" @upload="pdfUpload"></TFileUpload>

            <TButton class="btn-style" type="submit" label="GÖNDER"></TButton>
        </div>
    </form>
</template>

<script>
import { ref } from 'vue';
import { serverTimestamp } from 'firebase/firestore';
import addOfferMail from '@/firebase/addOfferMail';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
export default {
    name: "NewOfferPopup",
    setup() {
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        const sendMail = ref(null);
        const sendTitle = ref(null);
        const sendContent = ref(null);
        const firestore = getFirestore(app);
        const customerList = ref([]);
        const searchCompany = ref(null)
        const items = ref([]);
        const getUserFunc = (async () => {
            const q = query(collection(firestore, "customers"));
            await getDocs(q).then((qSnapshot) => {
                qSnapshot.forEach((item) => {
                    customerList.value.push(item.data());
                })
            })
        });
        getUserFunc();

        console.log("Gelen veri : ", customerList.value);

        const search = () => {
            const filteredUser = customerList.value.filter((item) => {
                return item.compName.toLowerCase().includes(searchCompany.value.toLowerCase());
            });

            filteredUser.forEach((item) => {
                items.value.push({
                    name: item.compName
                });
                console.log("Filtered : ", items.value);
            })
        }
        console.log("Filtered : ", items.value);


        const sendToOffer = async () => {
            if (emailRegex.test(sendMail.value) && sendTitle.value != null && sendContent.value != null) {
                const mailtoLink = `mailto:${sendMail.value}?subject=${encodeURIComponent(sendTitle.value)}&body=${encodeURIComponent(sendContent.value)}`;
                window.location.href = mailtoLink;

                const mailDetail = ({
                    send: sendMail.value,
                    title: sendTitle.value,
                    content: sendTitle.value,
                    mailDate: serverTimestamp()
                });

                await addOfferMail(mailDetail)

            }
        }

        return { sendToOffer, sendMail, sendContent, sendTitle, search, searchCompany, items }
    }

}
</script>

<style scoped>
.offer-area {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin: 10px 0;
}

.btn-style {
    margin: 10px 0;
    background-color: turquoise;
    border: 1px solid turquoise;
}
</style>