import Vue from 'vue'
import App from './App.vue'
import router from "./router"

import axios from 'axios'
import VueAxios from 'vue-axios'

require("@/assets/main.scss")
require("@fortawesome/fontawesome-free/scss/fontawesome.scss")
require("@fortawesome/fontawesome-free/js/all")

Vue.config.productionTip = false

Vue.use(VueAxios, axios)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
