<template>
    <TDialog :header="header" :style="style" :breakpoints="{
        '960px': '75vw',
        '640px': '90vw',
        '500px': '94vw'
    }"
    modal
    @update:visible="closeDialog()"
    :visible="true"
    >
    <slot name="dialogForm"></slot>

    <template #footer>
        <div style="width: 100%; height: 30px; border-top: 1px solid black; display: flex; justify-content: end;" >
            <PVButton :label="'İptal Et'" :severity="'danger'" :style="'width: 90px; height: 36px; margin-top: 10px; margin-right: 10px;'" @click="closeDialog"></PVButton>
            <PVButton :label="btnLabel" :style="'width: 90px; height: 36px; margin-top: 10px; margin-left: 10px;'" @click="onSubmit"></PVButton>
        </div>
    </template>
    </TDialog>

</template>

<script>
import PVButton from '@/components/PVButton.vue';
export default {
    name:"PVDialog",
    components:{PVButton},
    props: {
        header: {
            type: String,
            requried: true,
            default: "Popup Turkuvaz"
        },
        closeDialog:{
            type:Function,
            requried:true
        },
        style: {
            type:String,
            requried:false,
            default:"width:50vw; height:50vh;"
        },
        btnLabel: {
            type:String,
            default:"Kaydet",
        }
    },
    setup(props, {emit}){
        const onSubmit = () => {
            emit("onSubmit");
        }


        return {onSubmit}
    }

}
</script>

<style></style>