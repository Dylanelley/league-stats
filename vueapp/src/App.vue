<template>
  <div id="app">
    <div id="page-wrapper">
      
    <page-title/>
    
    <input-form/>

    <loading-bar :percent="20"/>
    
    </div>
    
    
    

  </div>
</template>

<script>

import InputForm from './components/InputForm.vue'
import PageTitle from './components/PageTitle.vue'
import LoadingBar from './components/LoadingBar.vue'

export default {
  name: 'App',
  components: {
    InputForm,
    PageTitle, 
    LoadingBar,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  height: 90vh;
}
.input-form {
  border: 0px solid black;
  width: 50%;
  min-width: 470px;
  margin: auto;
}

.page-title {
  margin: auto;
  text-align: center;
}

.loading-bar {
  margin: auto;
  margin-top: 100px;
  background: rgb(255, 255, 255);
  display: block;
  shape-rendering: auto; 
}
#page-wrapper {
  margin: auto;
  width: 70%;
  height: 100%;
  min-width: 500px;
  
  
}




</style>
