import Vue from 'vue'
import App from './App.vue'
import router from "./router"

require("@/assets/main.scss")

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
