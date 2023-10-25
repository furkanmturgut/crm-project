<template>
    <div v-if="finishSpinner">
        <TSpinner></TSpinner>
    </div>
</template>

<script>
export default {
    props:{
        finishSpinner:{
            type: Boolean,
            required: true
        }
    },
    name: 'SpinnerComponent',
 
}
</script>

<style scoped></style>