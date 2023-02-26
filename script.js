const STORAGE_KEY = "todos-vuejs-demo";
const todoStorage = {
  fetch: function () {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todos.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

const app = new Vue({
  el: "#app",
  data: {
    todos: [],
    options: [
      { value: -1, status: "すべて" },
      { value: 0, status: "作業中" },
      { value: 1, status: "完了" },
    ],
    current: -1,
  },
  computed: {
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.status;
      }, this);
    },
    labels() {
      return this.options.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.status });
      }, {});
    },
  },
  methods: {
    doAdd: function (event, value) {
      const todo = this.$refs.todo;
      console.log(todo);
      if (!todo.value.length) {
        return;
      }
      this.todos.push({
        id: todoStorage.uid++,
        todo: todo.value,
        tempTodo: todo.value,
        status: 0,
        editStatus: false,
      });

      todo.value = "";
    },
    doChangeStatus: function (item) {
      item.status = item.status ? 0 : 1;
    },
    doRemove: function (item) {
      const index = this.todos.indexOf(item);
      this.todos.splice(index, 1);
    },
    doEditMode: function (item) {
      const index = this.todos.indexOf(item);
      this.todos[index].editStatus = true;
      console.log(this.todos[index].editStatus);
    },
    doUpdate: function (item) {
      const index = this.todos.indexOf(item);
      console.log(this.$refs);

      const updTodo = this.$refs["updTodo" + item.id][0];

      if (!updTodo.value.length) {
        this.todos[index].editStatus = false;
        return;
      }
      this.todos[index].todo = updTodo.value;
      this.todos[index].tempTodo = updTodo.value;
      this.todos[index].editStatus = false;
    },
    saveTempTodo: function (item) {
      const index = this.todos.indexOf(item);
      console.log(this.$refs);

      const updTempTodo = this.$refs["updTodo" + item.id][0];

      if (!updTempTodo.value.length) {
        this.todos[index].editStatus = false;
        return;
      }
      this.todos[index].tempTodo = updTempTodo.value;
    },
  },
  created() {
    this.todos = todoStorage.fetch();
  },
});

app.mount("#app");
