<template>
    <TDataTable :value="filteredProject" showGridlines paginator :rows="7" tableStyle="width:100%;">
        <TColumn field="pName" sortable header="Proje Adı" style="20%"></TColumn>
        <TColumn v-if="!isUser" field="pCompany" header="Proje Firma" style="20%"></TColumn>
        <TColumn field="pPrice" sortable header="Proje Tutarı" style="20%"></TColumn>
        <TColumn field="pType" header="Proje Tipi" style="20%"></TColumn>
        <TColumn field="pDetail" header="Proje Açıklama" style="20%"></TColumn>
    </TDataTable>
</template>

<script>
import { computed } from 'vue';

export default {
    name: "ProjectComponent",
    props: {
        projectList: {
            type: Array,
            required: true
        },
        isUser: {
            type: Boolean,
            required: true
        },
        compName: {
            type: String,
            default: null,
            required: false
        }
    },
    setup(props) {
        const filteredProject = computed(() => {
            if (props.compName) {
                return props.projectList.filter((item) => {
                    return item.pCompany === props.compName;
                });
            } else {
                return props.projectList;
            }
        });

        return { filteredProject }
    }
}
</script>

<style></style>