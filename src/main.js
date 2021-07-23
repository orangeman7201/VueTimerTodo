import Vue from 'vue'
import App from './App.vue'
import Questions from './components/Questions.vue';
import router from './router';
import store from './store';




Vue.config.productionTip = true
Vue.component('Questions', Questions );

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
