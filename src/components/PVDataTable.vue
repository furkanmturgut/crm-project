<template>
    <TDataTable :value="dataList" paginator :rows="rowSize" tableStyle="max-width:100%;" :selectionMode="selectionMode"
        aria-haspopup="true" columnResizeMode="expand" :header="visibleState" v-model:filters="localFilters">
        <template #header v-if="visibleState">
            <div style="display: flex; justify-content: end;">
                <TButton icon="pi pi-refresh" rounded raised @click="refreshData"
                    style="color:white; background-color: turquoise; border: 1px solid turquoise; margin-right: 10px;"
                    v-tooltip.bottom="'Yenile'" />

                <download-excel :data="dataList" :name="excelName + '.xls'">
                    <TButton icon="pi pi-download" rounded raised
                        style="color:white; background-color: turquoise; border: 1px solid turquoise;"
                        v-tooltip.bottom="'\Excel\'e aktar'" />
                </download-excel>

            </div>
        </template>

        <slot name="columnSlot"></slot>


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
        rowSize: {
            type: Number,
            required: false,
            default: 5
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

<style scoped></style>