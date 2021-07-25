<template>
<div style="padding-left: 500px">
  
    <input type="radio" id="all" value="all" v-model="radioState">全て
    <input type="radio" id="working" value="working" v-model="radioState">作業中
    <input type="radio" id="finish" value="finish" v-model="radioState">完了

    <div class="circle"><div class="circle-inner">
      <div v-if="radioState === 'all'">
      <ul v-for="(todo, index) in inputTodos" :key="todo.task">
        <li>{{todo.task}}</li>
        <li>
            {{ ((todo.time / 1000) - (todo.time / 1000  % 60)) / 60 }}分{{ todo.time / 1000 % 60 }}秒
        </li>
        <li>
          <button v-if="inputTodos[index].timer === 'stop'" @click="timerStart(index)">開始</button>
          <button v-if="inputTodos[index].timer === 'going'" @click="timerStop(index)">ストップ</button>
        </li>
        <li><button @click="deleteItem(index)">削除</button></li>
      </ul>
      </div>


      <div v-if="radioState === 'working'">
      <ul v-for="(todo, index) in inputTodos" :key="todo.task">
        <li v-if="todo.state === 'working'">{{index}}</li>
        <li v-if="todo.state === 'working'">{{todo.task}}</li>
        <li v-if="todo.state === 'working'">
            {{ ((todo.time / 1000) - (todo.time / 1000  % 60)) / 60 }}分{{ todo.time / 1000 % 60 }}秒
        </li>
        <li v-if="todo.state === 'working'">
          <button v-if="inputTodos[index].state === 'working'" @click="changeState(index)">作業中</button>
          <button v-else @click="changeState(index)">完了</button>
        </li>
        <li v-if="todo.state === 'working'"><button @click="deleteItem(index)">削除</button></li>
      </ul>
      </div>


      <div v-if="radioState === 'finish'">
      <ul v-for="(todo, index) in inputTodos" :key="todo.task">
        <li v-if="todo.state === 'finish'">{{index}}</li>
        <li v-if="todo.state === 'finish'">{{todo.task}}</li>
        <li v-if="todo.state === 'finish'">
            {{ ((todo.time / 1000) - (todo.time / 1000  % 60)) / 60 }}分{{ todo.time / 1000 % 60 }}秒
        </li>
        <li v-if="todo.state === 'finish'">
          <button v-if="inputTodos[index].state === 'working'" @click="changeState(index)">作業中</button>
          <button v-else @click="changeState(index)">完了</button>
        </li>
        <li  v-if="todo.state === 'finish'"><button @click="deleteItem(index)">削除</button></li>
      </ul>
      </div>
    </div>
    </div>


    <form @submit.prevent="addTodo">
      <input type="text" v-model="newTodo">
        <select id="time" v-model="newTime">
          <option disabled value="">選択してください</option>
          <option value="300000">5分</option>
          <option value="600000">10分</option>
          <option value="1200000">20分</option>
          <option value="1800000">30分</option>
        </select>
      <input type="submit" value="追加">
    </form>
  
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        newTodo: '',
        newTime: '',
        timerState: '',
        radioState: 'all',
        start: 'ture',
      }
    },
    computed: {
      inputTodos() {
      return this.$store.getters.inputTodos;
      },
      styles () {
        return {
          '--color': this.color,
          '--width': this.width,
          '--timerCount': this.inputTodos.time,
        }
      }
    },
    methods: {
      addTodo: function() {
        let Item = {task: this.newTodo, state: "working", time: this.newTime, timer: 'stop'}
        this.inputTodos.push(Item);
        this.newTodo = '';
      },
      deleteItem: function(index) {
        this.inputTodos.splice(index,1)
      },
      changeState: function(index) {
        if (this.inputTodos[index].state === 'working') {
          this.inputTodos[index].state = 'finish'
        } else if (this.inputTodos[index].state === 'finish') {
          this.inputTodos[index].state = 'working'
        }
      },
      timerStart: function(index) {
        this.inputTodos[index].timer = 'going';
        const todosData = this.inputTodos[index];
        todosData.func = setInterval(function() {
          todosData.time -= 1000;
          if (todosData.time < 0) {
            clearInterval(todosData.func);
            todosData.timer = 'stop';
            alert(`${todosData.task}の終了時刻となりました`)
            todosData.time = '300000'
          }
        }.bind(this),1000);
      },
      timerStop: function(index) {
        this.inputTodos[index].timer = 'stop';
        clearInterval(this.inputTodos[index].func);
      }
    }
  }
</script>

<style scoped>
  .circle {
    --color: #333;
    --width: 100px;
    position: relative;
    width: 250px;
    height: 250px;
    background: var(--color);
    border-radius: 50%;
    text-align: center;
    overflow: hidden;
    z-index: 1;
}

.circle::before {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: -125px;
    width: 250px;
    height: 250px;
    background: #999;
    transform-origin: right 125px;
    z-index: 2;
    animation: rotate-circle-left 2s linear forwards;
}

.circle::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 125px;
    width: 250px;
    height: 250px;
    background: #999;
    transform-origin: left 125px;
    z-index: 3;
    animation: rotate-circle-right 2s linear forwards;
}

.circle .circle-inner {
    position: absolute;
    top: 25px;
    left: 25px;
    width: 200px;
    height: 200px;
    padding-top: 38px;
    background: #fff;
    border-radius: 50%;
    z-index: 4;
}

@keyframes rotate-circle-right {
    0%   {
        transform: rotate(0deg);
        background: #999;
    }
    50%  {
        transform: rotate(180deg);
        background: #999;
    }
    50.01% {
        transform: rotate(360deg);
        background: #333;
    }
    100% {
        transform: rotate(360deg);
        background: #333;
    }
}

@keyframes rotate-circle-left {
    0%   { transform: rotate(0deg); }
    50%  { transform: rotate(0deg); }
    100% { transform: rotate(180deg); }
}
</style>
