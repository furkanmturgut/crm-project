<template>
  <div class="home-area" >
    <label style="font-weight: bold; font-size: 34px; justify-content: center; display: flex;">Talepler</label>
    <TChart type="pie" :data="chartData" :options="chartOptions" class="chart-style" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getFirestore, query, collection, getDocs } from 'firebase/firestore';
import { app } from '@/firebase/config';
export default {
  name: "HomeView",
  setup() {
    const chartData = ref();
    const chartOptions = ref();
    const firestore = getFirestore(app);
    onMounted(async () => {
      const requestsList = [];
      const totalRequests = [];

      const q = query(collection(firestore, "requests"));
      await getDocs(q).then((snapshot) => {
        snapshot.forEach((item) => {
          requestsList.push(item.data());
        });

        // Tüm talepler
        const totalSize = requestsList.length;
        totalRequests.push(totalSize);

        // alınan talep
        const filtered = requestsList.filter((item) => {
          return item.state === true;
        });
        const trueState = filtered.length;
        totalRequests.push(trueState)

        // bekleyen talepler
        const filteredFalse = requestsList.filter((item) => {
          return item.state === false;
        });

        const falseState = filteredFalse.length;
        totalRequests.push(falseState);

        console.log(totalRequests)
        console.log(requestsList)
        
      });

      const setChartData = () => {
        const documentStyle = getComputedStyle(document.body);

        return {
          labels: ['Tüm Talepler', 'Alınan Talepler', 'Bekleyen Talepler'],
          datasets: [
            {
              data: totalRequests,
              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
            }
          ]
        };
      };

      const setChartOptions = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        return {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor
              }
            }
          }
        };
      };

      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    });

    return { chartData, chartOptions }
  }
}
</script>

<style scoped>
.home-area {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.chart-style {
  width: 30%;
}

@media only screen and (max-width:700px) {
    .chart-style {
      width: 100%;
    }
}
</style>