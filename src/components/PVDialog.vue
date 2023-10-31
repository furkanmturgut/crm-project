<template>
    <TDialog :header="header" :style="{ width: '50vw', height:'50vh' }" :breakpoints="{
        '960px': '75vw',
        '640px': '90vw',
        '500px': '90vw'
    }"
    modal
    @update:visible="closeDialog()"
    :visible="true"
    >

    <slot name="dialogForm"></slot>

    </TDialog>

</template>

<script>
export default {
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
        
    }

}
</script>

<style></style>