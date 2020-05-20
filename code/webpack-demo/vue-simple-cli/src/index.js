import Vue from 'vue'
import App from './App'

// new Vue({
//   el: '#app',
//   template: '<App/>',
//   components: {
//     App
//   }
// })

new Vue({
  el: '#app',
  render: h => h(App)
})