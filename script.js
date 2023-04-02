const STORAGE_KEY = "todo-list-vuejs";
const todoStorage = {
  fetch() {
    const todoList = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    todoList.forEach(function (todo, index) {
      todo.id = index;
    });
    todoStorage.uid = todoList.length;
    return todoList;
  },
  save(todoList) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
  },
};

const TODO_STATUS = { all: -1, wip: 0, done: 1 };

const app = Vue.createApp({
  data() {
    return {
      todoList: [],
      todoStatuses: [
        { value: TODO_STATUS.all, status: "すべて" },
        { value: TODO_STATUS.wip, status: "作業中" },
        { value: TODO_STATUS.done, status: "完了" },
      ],
      newTodo: "",
      selectedTodoStatus: -1,
      editIndex: null,
    };
  },
  computed: {
    filteredTodoList() {
      return this.todoList.filter((el) => {
        return this.selectedTodoStatus === TODO_STATUS.all
          ? true
          : this.selectedTodoStatus === el.status;
      });
    },
    todoStatuslabels() {
      return this.todoStatuses.reduce(function (a, b) {
        return Object.assign(a, { [b.value]: b.status });
      }, {});
    },
  },
  methods: {
    addTodo() {
      const newTodo = this.newTodo;
      if (!newTodo.length) {
        return;
      }
      this.todoList.push({
        id: todoStorage.uid++,
        todo: newTodo,
        status: TODO_STATUS.wip,
      });
      this.newTodo = "";
      todoStorage.save(this.todoList);
    },
    changeTodoStatus(item) {
      item.status = item.status ? TODO_STATUS.wip : TODO_STATUS.done;
      todoStorage.save(this.todoList);
    },
    removeTodo(item) {
      const index = this.todoList.indexOf(item);
      this.todoList.splice(index, 1);
      todoStorage.save(this.todoList);
    },
    editTodo(index) {
      this.editIndex = index;
    },
    updateTodo(item) {
      const updTodo = item.todo;
      this.editIndex = null;
      if (!updTodo.length) {
        return;
      }
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      todoStorage.save(this.todoList);
    },
  },
  created() {
    this.todoList = todoStorage.fetch();
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      },
    },
  },
});

app.mount("#app");
