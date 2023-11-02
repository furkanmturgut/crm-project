<template>
    <PVDialog :header="'Müşteri Ekle'" :closeDialog="closeDialog" @onSubmit="saveCustomer">
        <template #dialogForm>
            <form @submit.prevent="saveCustomer">
                <div class="add-area">
                    <div class="row-element">
                        <div class="input-left-element">
                            <label for="compName">Firma Adı</label>
                            <TInputText id="compName" placeholder="Firma Adı" v-model="companyName"
                                @input="formValidation(0)">
                            </TInputText>
                            <small v-if="errorState.name" class="error-class">{{ errorMsg.name }}</small>
                        </div>

                        <div class="input-right-element">
                            <label for="compPerson">Firma İletişim Yetkilisi</label>
                            <TInputText id="compPerson" placeholder="Firma İletişim Yetkilisi" v-model="companyPerson"
                                @input="formValidation(1)">
                            </TInputText>
                            <small v-if="errorState.person" class="error-class">{{ errorMsg.person }}</small>
                        </div>
                    </div>

                    <div class="row-element">
                        <div class="input-left-element">
                            <label for="compPhone">Firma Numarası (+90)</label>
                            <TInputMaskView id="compPhone" v-model="companyPhone" date="phone" mask="(999) 999-9999"
                                placeholder="5XX XXX XXXX" @input="formValidation(2)">
                            </TInputMaskView>
                            <small v-if="errorState.phone" class="error-class">{{ errorMsg.phone }}</small>
                        </div>

                        <div class="input-right-element">
                            <label for="compMail">Firma Email</label>
                            <TInputText id="compMail" placeholder="Firma Mail Adres" v-model="companyMail"
                                @input="formValidation(3)">
                            </TInputText>
                            <small v-if="errorState.mail" class="error-class">{{ errorMsg.mail }}</small>
                        </div>
                    </div>

                    <div class="row-element">
                        <div class="input-left-element">
                            <label for="compPass">Firma Parola</label>
                            <TInputText id="compPass" placeholder="Firma Parolası" v-model="companyPass"
                                @input="formValidation(5)">
                            </TInputText>
                            <small v-if="errorState.pass" class="error-class">{{ errorMsg.pass }}</small>
                        </div>

                        <div class="input-right-element">
                            <label>Müşteri Türü</label>
                            <TDropdown v-model="selectCustomerType" :options="customerType" optionLabel="type"
                                placeholder="Müşteri Durumu Seçin" showClear></TDropdown>
                        </div>
                    </div>

                    <div class="row-element">
                        <div class="input-left-element">
                            <label for="compAddress">Firma Adresi</label>
                            <TextArea id="compAddress" placeholder="Firma Adresi" autoResize rows="3" cols="10"
                                v-model="companyAddress" @input="formValidation(4)"></TextArea>
                            <small v-if="errorState.address" class="error-class">{{ errorMsg.address }}</small>
                        </div>

                    </div>
                </div>
                <TToast></TToast>
                <small class="error-class" style="display: flex; justify-content: center; margin-top: 10px;" v-if="errorState.all">{{ errorMsg.all }}</small>

            </form>
        </template>
    </PVDialog>
</template>

<script>
import { ref } from 'vue';
import addCustomer from '@/firebase/addCustomer';
import { serverTimestamp } from 'firebase/firestore';
import createUser from '@/firebase/createUser.js';
import { toastError, toastSuccess } from '@/components/Base/toast';
import PVDialog from '@/components/PVDialog.vue';
import {uid} from 'uid';
export default {
    name: "AddCustomerPopup",
    components: { PVDialog },
    props: {
        closeDialog: {
            type: Function,
            required: true
        },
    },
    setup(props) {
        const errorState = ref({ name: false, person: false, phone: false, mail: false, address: false, pass: false, all: false });
        const errorMsg = ref({ name: null, person: null, phone: null, mail: null, address: null, pass: null, all: false });
        const customerType = ref([
            { type: "Eski Müşteri" },
            { type: "Yeni Müşteri" },
            { type: "Potansiyel Müşteri" }
        ]);
        const companyName = ref('');
        const companyPerson = ref(null);
        const companyPhone = ref(null);
        const companyMail = ref(null);
        const companyPass = ref('');
        const companyAddress = ref('');
        const selectCustomerType = ref(null);
        let fullNameRegex = /[A-Za-z]+\s[A-Za-z]+/i;
        const phoneRegex = /\(\d\d\d\)\s\d\d\d-\d\d\d\d/i;
        const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
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
                case 5:
                    if (companyPass.value.length < 6) {
                        errorState.value.pass = true;
                        errorMsg.value.pass = "En az 6 karakter parola belirleyin";
                    } else {
                        errorState.value.pass = false;
                    }
                    break;
            }
        }

        const saveCustomer = async () => {
            if (fullNameRegex.test(companyPerson.value) &&
                phoneRegex.test(companyPhone.value) && emailRegex.test(companyMail.value) && companyName.value.length >= 4 && companyAddress.value.length >= 10 && selectCustomerType.value != null) {
                errorState.value.spinner = true;

                const customerData = {
                    id: uid(),
                    compName: companyName.value,
                    compPerson: companyPerson.value,
                    compPhone: companyPhone.value,
                    compEmail: companyMail.value,
                    compAddress: companyAddress.value,
                    addDate: serverTimestamp(),
                    customerType: selectCustomerType.value,
                    requestCount: 0
                };
                createUser(companyMail.value, companyPass.value, companyName.value);

                await addCustomer(customerData);
                toastSuccess("Müşteri başarıyla eklendi");
                setTimeout(() => {
                    // close dialog and refresh
                    props.closeDialog(true);
                }, 1000);

            } else {
                errorState.value.all = true;
                errorMsg.value.all = "Tüm alanları doldurunuz";
                toastError("Lütfen tüm alanları doldurunuz");
            }
        }

        return { customerType, companyName, companyPerson, companyPhone, companyMail, companyAddress, formValidation, errorMsg, errorState, saveCustomer, selectCustomerType, companyPass }
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

</style>