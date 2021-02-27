<template>
  <bar-chart :chart-data="datacollection"></bar-chart>
</template>

<script>
import BarChart from "@/components/BarChart";

export default {
  name: "Dashboard",
  components: {
    BarChart
  },
  data() {
    return {
      datacollection: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Games',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: [40, 20, 30, 50, 90, 10, 20, 40, 50, 70, 90, 100]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>