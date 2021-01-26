<template>
    <form class='input-form'>
        
        <input id="summoner-name" placeholder="Summoner Name">
        <select id="region" aria-placeholder="Region">
            <option value="OC1">OCE</option>
            <option value="NA1">NA</option>
            <option value="EUS">EU</option>
        </select>
        <select id="number-of-games">
            <option value=20>20</option>
            <option value=100>100</option>
            <option value=-1>All</option>
        </select>
        
        <button>Find Data</button>

    </form>
</template>

<script>

export default {
    name: "InputForm"
}
</script>

<style scoped>

#summoner-name {
    width: 40%;
}
select {
    width: 15%;
}
button:hover {
    background-color: azure;
    cursor: pointer;
}
input, select, button{
  padding: 8px 10px;
  margin: 8px 5px;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>