<template>
    <TMenu :ref="opElement" id="profile_menu" :model="profileItem" :popup="true" style="margin-top:10px;">
        <template #item="{ props, label }">
            <div class="overlayMenu">
                <span style="margin-right: 6px;" v-bind="props.icon"></span>
                <span>{{ label }}</span>
            </div>
        </template>
    </TMenu>
</template>

<script>
export default {
    props: {
        item: {
            type: Array || Number,
            required: true
        },
        opElement: {
            required: true
        }
    },
    setup() {
     
    }

}
</script>

<style></style>