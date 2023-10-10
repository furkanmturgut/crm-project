<template>
    <form @submit.prevent="saveCustomer">
        <div class="add-area">
            <label for="compName">Firma Adı</label>
            <TInputText id="compName" placeholder="Firma Adı" v-model="companyName" @input="formValidation(0)"></TInputText>
            <small v-if="errorState.name">{{ errorMsg.name }}</small>

            <label for="compPerson">Firma İletişim Yetkilisi</label>
            <TInputText id="compPerson" placeholder="Firma İletişim Yetkilisi" v-model="companyPerson"
                @input="formValidation(1)">
            </TInputText>
            <small v-if="errorState.person">{{ errorMsg.person }}</small>

            <label for="compPhone">Firma İrtibat Numarası (+90)</label>
            <TInputMaskView id="compPhone" v-model="companyPhone" date="phone" mask="(999) 999-9999"
                placeholder="5XX XXX XXXX" @input="formValidation(2)">
            </TInputMaskView>
            <small v-if="errorState.phone">{{ errorMsg.phone }}</small>

            <label for="compMail">Firma Email</label>
            <TInputText id="compMail" placeholder="Firma Mail Adres" v-model="companyMail" @input="formValidation(3)">
            </TInputText>
            <small v-if="errorState.mail">{{ errorMsg.mail }}</small>

            <label for="compAddress">Firma Adresi</label>
            <TextArea id="compAddress" placeholder="Firma Adresi" autoResize rows="3" cols="10" v-model="companyAddress"
                @input="formValidation(4)"></TextArea>
            <small v-if="errorState.address">{{ errorMsg.address }}</small>

            <label>Müşteri Türü</label>
            <div class="radio-area">
                <TRadioButton v-model="selectCustomerType" value="Eski Müşteri" name="customer"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Eski Müşteri</label>

                <TRadioButton v-model="selectCustomerType" value="Yeni Müşteri" name="customer"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Yeni Müşteri</label>


                <TRadioButton v-model="selectCustomerType" value="Potansiyel Müşteri" name="customer"></TRadioButton>
                <label style="margin-top: -5px; margin-left:6px; margin-right: 10px;">Potansiyel Müşteri</label>
            </div>

            <div v-if="errorState.spinner" style="display:flex; justify-content:center; margin-top:18px;">
                <TSpinner style="height: 50px;"></TSpinner>
            </div>
            <TButton v-show="!errorState.spinner" class="add-customer-btn" label="KAYDET" type="submit"></TButton>

            <TToast></TToast>
        </div>
    </form>
</template>

<script>
import { ref } from 'vue';
import addCustomer from '@/firebase/addCustomer';
import { serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
export default {
    name: "AddCustomerPopup",
    setup() {
        const errorState = ref({ name: false, person: false, phone: false, mail: false, address: false, spinner: false });
        const errorMsg = ref({ name: null, person: null, phone: null, mail: null, address: null });
        const companyName = ref('');
        const companyPerson = ref(null);
        const companyPhone = ref(null);
        const companyMail = ref(null);
        const companyAddress = ref('');
        const router = useRouter();
        const toast = useToast();
        const selectCustomerType = ref(null);
        let fullNameRegex = /[A-Za-z]+\s[A-Za-z]+/i;
        const phoneRegex = /\(\d\d\d\)\s\d\d\d-\d\d\d\d/i;
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        console.log("Selected : ", selectCustomerType.value);
        const formValidation = (type) => {
            switch (type) {
                case 0:
                    if (companyName.value.length <= 4) {
                        errorState.value.name = true;
                        errorMsg.value.name = "Lütfen en az 5 karakter içeren firma adı giriniz.";

                    } else {
                        errorState.value.name = false;
                    }
                    break;
                case 1:
                    if (fullNameRegex.test(companyPerson.value)) {
                        errorState.value.person = false;

                    } else {
                        errorState.value.person = true;
                        errorMsg.value.person = "Lütfen geçerli bir ad soyad giriniz.";
                    }
                    break;
                case 2:
                    if (phoneRegex.test(companyPhone.value)) {
                        errorState.value.phone = false;
                    } else {
                        errorState.value.phone = true;
                        errorMsg.value.phone = "Lütfen geçerli bir numara giriniz."
                    }
                    break;
                case 3:
                    if (emailRegex.test(companyMail.value)) {
                        errorState.value.mail = false;

                    } else {
                        errorState.value.mail = true;
                        errorMsg.value.mail = "Lütfen geçerli bir mail adresi giriniz."
                    }
                    break;
                case 4:
                    if (companyAddress.value.length <= 10) {
                        errorState.value.address = true;
                        errorMsg.value.address = "Lütfen açıklayıcı bir adres yazınız.";
                    } else {
                        errorState.value.address = false;
                    }
                    break;
            }
        }

        const saveCustomer = async () => {
            errorState.value.spinner = true;
            if (fullNameRegex.test(companyPerson.value) &&
                phoneRegex.test(companyPhone.value) && emailRegex.test(companyMail.value) && companyName.value.length >= 4 && companyAddress.value.length >= 10 && selectCustomerType.value != null) {

                const customerData = {
                    compName: companyName.value,
                    compPerson: companyPerson.value,
                    compPhone: companyPhone.value,
                    compEmail: companyMail.value,
                    compAddress: companyAddress.value,
                    addDate: serverTimestamp(),
                    customerType: selectCustomerType.value
                };

                await addCustomer(customerData);
                toast.add({
                    severity: 'success', life: 1500, summary: 'Müşteri Kayıt', detail: "Müşteri başarıyla eklendi."
                });
                errorState.value.spinner = false;
                setTimeout(() => {
                    router.go({ name: 'CustomerView' });

                }, 1500);

            }
        }

        return { companyName, companyPerson, companyPhone, companyMail, companyAddress, formValidation, errorMsg, errorState, saveCustomer, selectCustomerType }
    }

}
</script>

<style scoped>
.add-area {
    display: flex;
    flex-direction: column;
}

label {
    color: black;
    font-weight: bold;
    margin: 10px 0;
}

.add-customer-btn {
    background-color: turquoise;
    margin: 16px 0;
    border: 1px solid turquoise;
}

small {
    color: red;
    font-weight: bold;
}

.radio-area {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
}
</style>