<template>
    <PVDialog :header="'Yeni Teklif Oluştur'" :closeDialog="closeDialog" @onSubmit="sendToOffer">
        <template #dialogForm>
            <form @submit.prevent="sendToOffer">
                <div class="offer-area">
                    <div class="row-element">
                        <div class="input-left-element">
                            <label>Mail atılacak firmayı arayın</label>
                            <TAutoComplete inputStyle="width:100%" v-model="searchCompany" @change="selectCompany"
                                :suggestions="items" optionLabel="name" @complete="search"></TAutoComplete>
                        </div>

                        <div class="input-right-element">
                            <label>Gönderilecek Email</label>
                            <TInputText placeholder="Email" v-model="sendMail"></TInputText>
                        </div>
                    </div>

                    <div class="row-element">
                        <div class="input-left-element">
                            <label>Konu Başlığı</label>
                            <TInputText placeholder="Başlık" v-model="sendTitle"></TInputText>
                        </div>
                        <div class="input-right-element">
                            <label>Konu İçeriği</label>
                            <TextArea placeholder="Proje Açıklaması" autoResize rows="5" cols="30"
                                v-model="sendContent"></TextArea>
                        </div>
                    </div>

                    <div class="row-element">
                        <div class="input-left-element" style="margin-top:-100px;">
                            <label>PDF Dosyası</label>
                            <TFileUpload mode="basic" chooseLabel="Yükle" accept="application/pdf" @upload="pdfUpload"
                                style="width: 50%; background-color: turquoise; border: 1px solid turquoise;">
                            </TFileUpload>
                        </div>
                        <div class="input-right-element">

                        </div>
                    </div>
                    <TToast></TToast>
                </div>
            </form>
        </template>
    </PVDialog>
</template>

<script>
import { ref } from 'vue';
import { serverTimestamp } from 'firebase/firestore';
import addOfferMail from '@/firebase/addOfferMail';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { toastError, toastSuccess } from '@/components/Base/toast';
import PVDialog from '@/components/PVDialog.vue';
export default {
    components: { PVDialog },
    name: "NewOfferPopup",
    props: {
        closeDialog: {
            type: Function,
            required: true
        }
    },
    setup(props) {
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

        const search = () => {
            items.value = [];
            const filteredUser = customerList.value.filter((item) => {
                return item.compName.toLowerCase().includes(searchCompany.value.toLowerCase());
            });

            filteredUser.forEach((item) => {
                items.value.push({
                    name: item.compName,
                    mail: item.compEmail
                });
            })
        }

        const selectCompany = () => {
            const compMail = searchCompany.value.mail
            if (compMail != undefined) {
                sendMail.value = compMail;
            }
        }

        const sendToOffer = async () => {
            if (emailRegex.test(sendMail.value) && sendTitle.value != null && sendContent.value != null) {
                const mailtoLink = `mailto:${sendMail.value}?subject=${encodeURIComponent(sendTitle.value)}&body=${encodeURIComponent(sendContent.value)}`;
                window.location.href = mailtoLink;

                const mailDetail = ({
                    send: sendMail.value,
                    title: sendTitle.value,
                    content: sendContent.value,
                    mailDate: serverTimestamp()
                });

                await addOfferMail(mailDetail);
                toastSuccess("Mail başarıyla yollandı")

                setTimeout(() => {
                    props.closeDialog(true);
                }, 1000);

            } else {
                toastError("Mail gönderilemedi işlemleri kontrol edin");
            }
        }

        return { sendToOffer, sendMail, sendContent, sendTitle, search, searchCompany, items, selectCompany }
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
</style>