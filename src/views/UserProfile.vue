<template>
    <PVDialog :closeDialog="closeDialog" :header="'Profil'" :style="'width:30vw; height:60vh;'" :btnLabel="'Düzenle'"
        @onSubmit="saveProfile">
        <template #dialogForm>
            <form @submit.prevent="saveProfile">
                <div style="display: flex; flex-direction: column;">
                    <label>İletişim Numarası</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-phone" style="margin-top: -8px;" />
                        <TInputMaskView v-model="companyPhone" date="phone" mask="(999) 999-9999" placeholder="5XX XXX XXXX"
                            style="width: 100%;"></TInputMaskView>
                    </span>
                    <label>Email Adres</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-envelope" style="margin-top: -8px;" />
                        <TInputText style="width: 100%;"></TInputText>
                    </span>

                    <label>Parola</label>
                    <span class="p-input-icon-right">
                        <i class="pi pi-unlock" style="margin-top: -8px;" />
                        <TInputText style="width: 100%;" type="password"></TInputText>
                    </span>
                </div>

            </form>
        </template>
    </PVDialog>
</template>

<script>
import PVDialog from '@/components/PVDialog.vue';
export default {
    name: "UserProfilePopup",
    props: {
        closeDialog: {
            type: Function,
            requried: true
        }
    },
    components: { PVDialog },
    setup() {

    }

}
</script>

<style scoped>
label {
    font-weight: bold;
    margin: 10px 0;
}
</style>