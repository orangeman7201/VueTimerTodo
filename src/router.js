import Vue from 'vue';
import Router from 'vue-router';
import Questions from './components/Questions.vue';

Vue.use(Router);

export default new Router ({
  routes: [ 
     {path: '/', component: Questions},
  ]
})