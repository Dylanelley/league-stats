<template>
  <table class="table">
    <thead>
      <tr>
        <th>Champion</th>
        <th>Games Played</th>
        <th>Win Rate</th>
        <th>Average KDA</th>
        <th>Max Kills</th>
        <th>Penta Kills</th>
      </tr>
    </thead>
    <tbody id="championStats">
      <tr :key="champion.id" v-for="champion in championData">
        <td>{{champion.championName}}</td>
        <td>{{champion.gamesPlayed}}</td>
        <td>{{champion.wins/champion.gamesPlayed * 100}}%</td>
        <td>{{champion.averageKDA[0]}}/{{champion.averageKDA[1]}}/{{champion.averageKDA[2]}}</td>
        <td>{{champion.maxKIlls}}</td>
        <td>{{champion.totalPentakills}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ChampionTable",
  
  data() {
    return {
      championData: [
        {
          "championName": "VI",
          "gamesPlayed": 20,
          "wins": 10,
          "averageKDA": [5.5, 3, 10], // 5.5/3/10
          "maxKIlls": 34,
          "totalPentakills": 1
        },
        {
          "championName": "ZED",
          "gamesPlayed": 20,
          "wins": 5,
          "averageKDA": [5.5, 3, 10],
          "maxKIlls": 34,
          "totalPentakills": 1
        },
        {
          "championName": "ZAC",
          "gamesPlayed": 20,
          "wins": 1,
          "averageKDA": [5.5, 3, 10],
          "maxKIlls": 34,
          "totalPentakills": 1
        }

      ]
    }
  },
  mounted() {
    //find data from backend to fill match
  },

}

</script>