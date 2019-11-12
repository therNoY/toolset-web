// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './store'
// 图表
// import VCharts from 'v-charts'
// collapse 展开折叠
// import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'

Vue.use(ElementUI)
Vue.prototype.$http=axios
Vue.config.productionTip = false
// Vue.component(CollapseTransition.name, CollapseTransition)
//Vue.use(VCharts)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

