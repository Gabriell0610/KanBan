//Pegando os elementos
const openModalBtn = document.querySelector("#open-modalBtn");
const btnCloseModal = document.querySelector("#btn-closeModal");
const modal = document.querySelector("#modal");
const todoInput = document.querySelector("#todo-input");
const deadlineInput = document.querySelector("#deadline");
const priorityInput = document.querySelector("#priority");
const btnAddTodo = document.querySelector("#btn-add-todo");
const todoColumn = document.querySelector("#todo-column");
const idInput = document.getElementById("id-input");
const titleBox = document.getElementById("title-box");
const body = document.getElementById('body')

const btnEditTodo = document.querySelector("#btn-edit-todo");

const todoList = [];
let nextTodoId = 1;

const createCardTodo = () => {
    // Limpar o body antes de recriar os cards
    body.innerHTML = "";
  
    todoList.forEach((data) => {
      // Criando elementos para cada tarefa

      //Criando o card que armazenará as tarefas.
      const cardTodo = document.createElement("div");
      cardTodo.classList.add("card-todo");
      cardTodo.style.display = "block";
  
  
      // Pegando a data de prazo
      const formattedDate = moment(data.deadline).format("DD/MM/YYYY");

      const dateTodoSpan = document.createElement("span");
      dateTodoSpan.classList.add("date-todo");
      dateTodoSpan.innerText = formattedDate;
  
      const dateTodo = document.createElement("p");
      dateTodo.textContent = "Prazo: ";
      dateTodo.appendChild(dateTodoSpan);
  
      // Pegando o nome da tarefa
      const todo = document.createElement("p");
      todo.classList.add("todo");
      todo.innerText = data.todo;
  
      // Pegando a prioridade da tarefa
      const prioritySpan = document.createElement("span");
      prioritySpan.classList.add("priority-todo");
      prioritySpan.innerText = data.priority;
  
      const priority = document.createElement("p");
      priority.textContent = "Prioridade: ";
      priority.appendChild(prioritySpan);
  
      // Verificando se a prioridade da tarefa é alta, média ou alta
      switch (data.priority) {
        case "Alta":
          prioritySpan.classList.add("high");
          break;
        case "Média":
          prioritySpan.classList.add("average");
          break;
        case "Baixa":
          prioritySpan.classList.add("low");
          break;
        default:
      }
  
      cardTodo.appendChild(dateTodo);
      cardTodo.appendChild(todo);
      cardTodo.appendChild(priority);

      //Colocando o cardTodo como filho do bdy
      body.appendChild(cardTodo)
  
      // Adicionando o body à coluna de tarefas
      todoColumn.appendChild(body);

       // Chamando a função de edição
       openModalEditTodo(cardTodo, data);
    });
};
  

const openModal = (id) => {
  modal.style.display = "flex";

  if (id) {
    titleBox.innerText = "Edite sua Tarefa";

    btnAddTodo.style.display = "none";
    btnEditTodo.style.display = "block";

    /* O método findIndex está pegando um objeto nos index que existem, 
    por exemplo se tiver dois objetos ele vai percorrer pelos index 0 e 1. 
     E com isso está vendo se o id do objeto é igual ao o id que é fornecido, 
    ou seja, se o id fornecido for 2 ele vai retornar o objeto cujo o seu id é 2. 
    */

    const existingTodoIndex = todoList.findIndex((todo) => {
      return todo.id == id;
    });

    console.log(
      "Index do objeto que contem o mesmo id da tarefa que foi clicado duas vezes:",
      existingTodoIndex
    );

    const dataEdit = todoList[existingTodoIndex];

    // Preenchendo os campos do modal com os valores da tarefa existente

    idInput.value = dataEdit.id; // id para controle de edição
    todoInput.value = dataEdit.todo;
    deadlineInput.value = dataEdit.deadline;
    priorityInput.value = dataEdit.priority;

  } else { // se não tiver em modo de edição
    titleBox.innerText = "Nova Tarefa";
    btnAddTodo.style.display = "block";
    btnEditTodo.style.display = "none";
  }
};

const closeModal = () => {
  modal.style.display = "none";
  idInput.value = "";
  todoInput.value = "";
  deadlineInput.value = "";
};

//Guardando as tarefas dentro de um objeto
const createTask = () => {
  const newTodo = {
    id: nextTodoId,
    deadline: deadlineInput.value,
    todo: todoInput.value,
    priority: priorityInput.value,
  };

  //Armazendo o objeto dentro de um array
  todoList.push(newTodo);
  console.log(todoList);

  //Acrescentando 1 no id de cada task criada
  nextTodoId++;

  //Chamando a função que cria o card da tarefa
  createCardTodo();
};

//Guardando as tarefas editadas dentro de um novo objeto
const editTask = () => {
  console.log("Editando tarefa com ID:", idInput.value);

  const taskEdit = {
    id: idInput.value,
    deadline: deadlineInput.value,
    todo: todoInput.value,
    priority: priorityInput.value,
  };

  const taskIndex = todoList.findIndex((todo) => {
    return todo.id == idInput.value;
  });

  todoList[taskIndex] = taskEdit;

  createCardTodo()

};


const openModalEditTodo = (cardTodo, data) => {

  cardTodo.addEventListener("dblclick", () => {
    openModal(data.id);
    console.log("id do objeto clicado duas vezes: ", data.id);

  });
};




//Eventos
btnAddTodo.addEventListener("click", (e) => {
  if (
    todoInput.value == "" ||
    deadlineInput.value == "" ||
    priorityInput.value == ""
  ) {
    alert("preencha todo os campos");
    return;
  } else {
    createTask();
  }

  closeModal();
});

btnEditTodo.addEventListener("click", () => {
  editTask();
  closeModal();
});

btnCloseModal.addEventListener("click", () => {
  closeModal();
});

openModalBtn.addEventListener("click", () => {
  openModal();
});


