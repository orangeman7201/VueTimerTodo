<template>
  <div style="padding-left: 500px">
    <h1>何かやるときは目標時間を設定してから</h1>
    <ul v-for="(todo, index) in inputTodos" :key="todo.task">

      <div style="position:relative;width:200px;height:200px;margin:15px">
        <div style="position:absolute;z-index:10000;width:200px;height:200px;display: flex; justify-content: center;align-items: center;text-align: center;font-size:20px;font-weight: bold;">
         
          <div>
            <li style="height:20px">{{todo.task}}</li>
            <li style="height:20px">
                {{ ((todo.time / 1000) - (todo.time / 1000  % 60)) / 60 }}分{{ todo.time / 1000 % 60 }}秒
            </li>
            <li style="height:30px;padding: 5px">
              <button v-if="inputTodos[index].timer === 'stop'" @click="timerStart(index)">開始</button>
              <button v-if="inputTodos[index].timer === 'going'" @click="timerStop(index)">ストップ</button>
            </li>
            <li style="height:30px;padding: 5px"><button @click="deleteItem(index)">削除</button></li>
          </div>
        </div>

        <div class="square" style="right:0">
          <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngle(index)">
            <div class="circle" style="left:0;"></div>
          </div>
        </div>

        <div class="square" style="left:0;">
          <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngle(index)">
            <div class="circle" style="right:0;"></div>
          </div>
        </div>

      </div>
    </ul>

    <form @submit.prevent="addTodo">
      <input type="text" v-model="newTodo" placeholder="入力してください">
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
      }
    },
    computed: {
      inputTodos() {
        return this.$store.getters.inputTodos;
      },
      remainingTime() {
        return function(index) {
          return this.inputTodos[index].time;
        }
      },
      currentAngle() {
        return function(index) {
          return (360 - (this.remainingTime(index)/this.inputTodos[index].setTime) * 360);
        }
      },
      rightAngle() {
        return function(index) {
          let angle = Math.min(this.currentAngle(index), 180);
          return {
            "transform": "rotate(" + angle + "deg)",
        }
        }
      },
      leftAngle() {
        return function(index) {
          let angle = Math.min(Math.max(this.currentAngle(index)-180, 0),180);
          return {
            "transform": "rotate(" + angle + "deg)",
        }
        }
      },
    },
    methods: {
      addTodo: function() { 
        let Item = {task: this.newTodo, state: "working", time: this.newTime, setTime: this.newTime, timer: 'stop'}
        this.inputTodos.push(Item);
        this.newTodo = '';
        this.newTime = '';
        document.documentElement.style.setProperty('--timerCountAfterColor', '#999')
        document.documentElement.style.setProperty('--timerCountBeforeColor', '#999')
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
          const x = 360 -  ((todosData.time)/(todosData.setTime)) * 360;
          const y = 180 -  ((todosData.time)/((todosData.setTime) / 2)) * 180;
          if (x <= 180) {
            document.documentElement.style.setProperty('--timerCountAfter', `${x}`);
          } else {
            document.documentElement.style.setProperty('--timerCountAfter', '0')
            document.documentElement.style.setProperty('--timerCountAfterColor', '#333')
            document.documentElement.style.setProperty('--timerCountBefore', `${y}`);
          }
          if (todosData.time < 0) {
            clearInterval(todosData.func);
            todosData.timer = 'stop';
            alert(`${todosData.task}の終了時刻となりました`)
            todosData.time = '300000'
            document.documentElement.style.setProperty('--timerCountAfterColor', '#999')
            document.documentElement.style.setProperty('--timerCountBefore', '0');
          }
        }.bind(this),1000);
      },
      timerStop: function(index) {
        this.inputTodos[index].timer = 'stop';
        clearInterval(this.inputTodos[index].func);
      },
    }
  }
</script>

<style scoped>
  .square{
    position:absolute;
    width:100px;
    height:200px;
    overflow:hidden;
  }
  .circle{
    position:absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    /*background-color: green;*/
    border:10px solid green;
    box-sizing: border-box;
  }

</style>
