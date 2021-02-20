<template>
  <table class="table">
    <thead>
      <tr>
        <th>Champion</th>
          <th>Games Played</th>
          <th>Average KDA</th>
          <th>Max Kills</th>
          <th>Penta Kills</th>
      </tr>
    </thead>
  </table>
</template>

<script>
export default {
  name: "ChampionTable",
  data() {
    return {
      matches: [
        {
          "platformId": "OC1",
          "gameId": 407776859,
          "champion": 222,
          "queue": 450,
          "season": 13,
          "timestamp": 1613797694027,
          "role": "DUO_SUPPORT",
          "lane": "NONE",
          "match": {
            "participantId": 8,
            "team": "",
            "stats": {
              "win": false,
              "topFragger": false,
              "kills": {},
              "deaths": 0,
              "assists": 0,
              "damageDealtToChampions": 0,
              "totalMinionsKilled": 0,
              "goldEarned": 0
            },
            "opponents": [
              "eXzchaser",
              "Chicken Parmi",
              "Minchy",
              "HellScytheX",
              "æügh",
              "2012",
              "U2l",
              "Bongy",
              "Obens"
            ],
            "topFragger": false
          },
          "championName": "JINX"
        },
        {
          "platformId": "OC1",
          "gameId": 407773777,
          "champion": 127,
          "queue": 450,
          "season": 13,
          "timestamp": 1613795100325,
          "role": "DUO_SUPPORT",
          "lane": "TOP",
          "match": {
            "participantId": 3,
            "team": "",
            "stats": {
              "win": false,
              "topFragger": false,
              "kills": {},
              "deaths": 0,
              "assists": 0,
              "damageDealtToChampions": 0,
              "totalMinionsKilled": 0,
              "goldEarned": 0
            },
            "opponents": [
              "Sazfinger",
              "Queen Elsa",
              "Bongy",
              "BubbAkushhh",
              "moonstoner",
              "Kill My Support",
              "SHYN1",
              "3190248",
              "ıˉı"
            ],
            "topFragger": false
          },
          "championName": "LISSANDRA"
        }
      ]
    }
  }
}
</script>