import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: [
      {task: '掃除', state: "working", time: 6000, timer: 'stop'},
    ]
  },
  getters: {
    inputTodos: state => {
      return state.todos
    }
  }
})