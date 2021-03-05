<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h1 class="card-header-title">Test</h1>
      </div>
      <div class="card-content">
        <bar-chart :chart-data="datacollection"></bar-chart>
        <champion-table></champion-table>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/BarChart";
import ChampionTable from "@/components/ChampionTable";

export default {
  name: "Dashboard",
  components: {
    BarChart,
    ChampionTable
  },
  data() {
    return {
      datacollection: {
        labels: [],
        datasets: [
          {
            label: 'Games',
            backgroundColor: '#f87979',
            pointBackgroundColor: 'white',
            borderWidth: 1,
            pointBorderColor: '#249EBF',
            data: []
          }
        ]
      }
    }
  },
  mounted() {
    this.getMatchesStats()
  },
  methods: {
    getMatchesStats() {
      let options = {
        'name': 'happyfridge24',
        'region': 'OC1',
        'type': 450,
        'amount': 2
      }

      this.$http.post("http://localhost:4000/match", options)
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error(error);
          });
    }
  }
}
</script>

<style scoped>

</style>