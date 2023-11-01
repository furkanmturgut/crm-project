<template>
  <TButton :label="label" :style="style" :severity="severity"></TButton>
</template>

<script>
export default {
    props:{
        label:{
            type:String,
            required:true,
        },
        style: {
            type:String,
            required:true
        },
        severity:{
            type:String,
            required:false,
            default:"success"
        }
    }

}
</script>

<style>

</style>