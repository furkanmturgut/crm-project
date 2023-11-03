<template>
    <div class="main-area">
        <header-component :mainTitle="'Görüşme Notları'" :btnTitle="'Görüşme Notu Ekle'"
            @btnClick="isDialog = true"></header-component>
        <interview-popup :closeDialog="closeDialog" v-if="isDialog"></interview-popup>
        <div class="component-area-project">
            <TAccordion v-for="note in notesGroupList" :key="note.id" class="panel-menu">
                <TAccordionTab>
                    <template #header>
                        <span style="color:black; margin-left: 20px;">{{ note[0].cNameTitle }}</span>
                    </template>
                    <TAccordion v-for="noteDetail in note" :key="noteDetail.id" style="margin: 10px 0;">
                        <TAccordionTab>
                            <template #header>
                                <span style="color: black; margin-left:20px ;">{{ new
                                    Date(noteDetail.date).toLocaleDateString("tr-TR") }}</span>
                            </template>

                            <div style="display: flex; margin: 10px 0;">
                                <label>Başlık: </label>
                                <span style="color:black;">{{ noteDetail.title }}</span>
                            </div>
                            <span style="width: 100%; border-top: 1px solid black;"></span>

                            <div style="display: flex; margin: 10px 0;">
                                <label>Görüşme Türü: </label>
                                <span style="color:black;">{{ noteDetail.interviewType }}</span>
                            </div>
                            <span style="width: 100%; border-top: 1px solid black;"></span>

                            <div style="display: flex; margin: 10px 0;">
                                <label>Görüşme Notu: </label>
                                <span style="color:black;">{{ noteDetail.detail }}</span>
                            </div>
                            <span style="width: 100%; border-top: 1px solid black;"></span>
                        </TAccordionTab>
                    </TAccordion>

                </TAccordionTab>
            </TAccordion>
        </div>
    </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue';
import InterviewPopup from './InterviewPopup.vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { ref, onMounted } from 'vue';
export default {
    name: "InterviewNotes",
    components: { HeaderComponent, InterviewPopup },
    setup() {
        const isDialog = ref(false);
        const firestore = getFirestore(app);
        const notesList = ref([]);
        const notesGroupList = ref([]);
        const closeDialog = () => {
            isDialog.value = false;
        }

        onMounted(() => {
            getData();
        });

        const getData = async () => {
            const q = query(collection(firestore, "interviewNotes"));
            await getDocs(q).then((snapshot) => {
                snapshot.forEach((item) => {
                    notesList.value.push(item.data());
                });

                const companyGroup = {};
                notesList.value.forEach((data) => {
                    const { company, ...myData } = data;

                    if (company in companyGroup) {
                        companyGroup[company].push(myData);
                    } else {
                        companyGroup[company] = [myData];
                    }
                    notesGroupList.value = companyGroup;
            });
        });
    }

        return { closeDialog, isDialog ,notesGroupList}
}

}
</script>

<style scoped>
.panel-menu {
  width: 50%;
  margin: 10px 0;
}

label {
  color: black;
  font-weight: bold;
  margin-right: 4px;
}

span {
  display: flex;
  align-items: center;
  color: white;
}


@media only screen and (max-width: 700px) {
  .panel-menu {
    width: 100%;
  }
}
</style>