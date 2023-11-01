<template>
    <TDataTable :value="dataList" tableStyle="max-width:100%;" :selectionMode="selectionMode" aria-haspopup="true" paginator
        :rows="4" columnResizeMode="expand" :header="visibleState" v-model:filters="localFilters">
        
        <slot name="columnSlot"></slot>
        <template #paginatorstart>
            <TButton icon="pi pi-refresh" @click="refreshData" text style="color: turquoise;"
                v-tooltip.bottom="'Yenile'" />
        </template>

        <template #paginatorend>
            <download-excel :data="dataList" :name="excelName + '.xls'" v-if="visibleState">
                    <TButton icon="pi pi-download" text 
                        style="color:turquoise;"
                        v-tooltip.bottom="'\Excel\'e aktar'" />
                </download-excel>
            </template>
    </TDataTable>
</template>

<script>
import { computed } from 'vue';
export default {
    name: "PVDataTable",
    props: {
        dataList: {
            required: true,
            type: Array,
        },
        visibleState: {
            required: true,
            type: Boolean
        },
        selectionMode: {
            type: String,
            required: false,
            default: "single"
        },
        filterDisplay: {
            required: false,
            default: "row"
        },
        excelName: {
            type: String,
            default: "trkvz",
            required: false
        },
        filters: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props, { emit }) {
        const localFilters = computed({
            get: () => props.filters,
            set: (value) => {
                emit("update:filters", value)
            }
        })

        const refreshData = () => {
            emit("refreshData");
        }

        return { refreshData, localFilters }
    }

}
</script>

<style scoped>

</style>