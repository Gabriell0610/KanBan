import { dragstartHandler, dropHandler, dragOverHandler} from './dragAndDrop.js'

//Pegando os elementos
const closeModalBtn = document.querySelector("#btn-closeModal");
const modalContainer = document.querySelector(".modal-container");
const boxModal = document.querySelector(".box-modal");
const titleBox = document.getElementById("title-box");

const nameTodoInput = document.querySelector("#todo-input");
const deadlineInput = document.querySelector("#deadline");
const priorityInput = document.querySelector("#priority");
const categoryInput = document.querySelector("#category");
const idInput = document.getElementById("id-input");

const btnAddTodo = document.querySelector("#btn-add-todo");
const btnEditTodo = document.querySelector("#btn-edit-todo");
const btnCreateTodo = document.querySelectorAll(".btn-create-todo");
const body = document.querySelectorAll(".body");

let indexTodo;
//Criando o id com números aleatórios para não ter conflito de ID
let nextTodoId = Math.floor(Math.random() * 5000)

//A variável tasks armazena os dados que foram pegos no localStorage com o método getItem
const tasks = localStorage.getItem("tasks");

/*O array taskList verifica se essas taks exitem, se existirem transforma as tasks
em objetos já que são strings, ou caso não tiver tasks no localStorage irá retornar um array vazio*/
export const taskList = tasks ? JSON.parse(tasks) : [];
console.log(taskList)

//Função createCardTodo é chamado para deixar visível na tela as tasks que existem no localStorage
createCardTodo();

//Guardando as tarefas dentro de um objeto
function createTask() {
  const newTodo = {
    id: nextTodoId,
    deadline: deadlineInput.value,
    todo: nameTodoInput.value,
    priority: priorityInput.value,
    category: categoryInput.value,
  };

  //Armazenando o objeto dentro de um array
  taskList.push(newTodo);
  console.log(taskList);

  //Pegando os objetos dentro do array taskList e armazenando em forma de string para o localStorage sob a chave tasks
  localStorage.setItem("tasks", JSON.stringify(taskList));

  //Chamando a função que cria o card da tarefa
  createCardTodo();
}

//Criando as tarefas dinâmicamente
export function createCardTodo() {
  // Limpar o body antes de recriar os cards
  body.forEach((bodyElement) => {
    bodyElement.innerHTML = "";
  });

  // Verificar se taskList é um array antes de iterar sobre ele
  if (!Array.isArray(taskList)) {
    console.error("Os dados salvos no localStorage não são um array.");
    return;
  }

  //Percorrendo todos os objetos do array taskList
  taskList.forEach((data) => {
    // Criando elementos para cada tarefa

    //Criando o card que armazenará as tarefas.
    const cardTodo = document.createElement("div");
    cardTodo.classList.add("card-todo");

    ///////////////////////////////////////////////////////////
    //Parte do drag on drop
    cardTodo.draggable = true;

    cardTodo.id = `todo-${data.id}`;

    cardTodo.addEventListener("dragstart", (event) => {
      dragstartHandler(event, data);
    });
    //////////////////////////////////////////////////////////

    //Formatando a data de prazo
    const formattedDate = moment(data.deadline).format("DD/MM/YYYY");

    // Pegando a data de prazo
    const dateTodoSpan = document.createElement("span");
    dateTodoSpan.classList.add("date-todo");
    dateTodoSpan.innerText = formattedDate;

    const dateTodo = document.createElement("p");
    dateTodo.textContent = "Prazo: ";
    dateTodo.appendChild(dateTodoSpan);

    //Chamando a função para checar se a data está no passado
    checkDateTodo(formattedDate, dateTodoSpan);

    //Criando o elemento do ícone de lixeira
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash", "trash");

    //Função que deleta as tarefas
    delTodoCard(trashIcon, cardTodo, data.id);

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

    cardTodo.appendChild(dateTodo)
    cardTodo.appendChild(todo);
    cardTodo.appendChild(priority);
    cardTodo.appendChild(trashIcon)

    // adicionando o cardTodo no body da coluna selecionada pelo usuário e colocando
    // o cardTodo como filho desse body
    const columnBody = document.querySelector(`[data-column='${data.category}'] .body`);
    columnBody.appendChild(cardTodo);

    // Chamando a função de edição
    openModalEditTodo(cardTodo, data.id, data.category);
  });
}

function openModalEditTodo(cardTodo, id, category) {
  cardTodo.addEventListener("dblclick", (event) => {
    //Pegando a categoria da tarefa que recebeu o dbclick
    console.log("Categoria da tarefa que recebeu o dbclick: ", category);

    //Adicionando a categoria da tarefa, no input de categoria
    //Pois antes, o input de categoria tinha o valor da última categoria selecionada
    categoryInput.value = category;

    //Verificar se o clique não foi no ícone da lixeira para nao ocorrer nenhum conflito
    if (!event.target.classList.contains("trash")) {
      console.log("id da tarefa que recebeu o dblclick: ", id);
      modalContainer.classList.add("modal-show");

      //Mudando características do modal para modo de edição
      titleBox.innerText = "Edite sua Tarefa";
      btnAddTodo.style.display = "none";
      btnEditTodo.style.display = "block";

      /* O método findIndex está percorrendo os objeto nos index que existem, 
        por exemplo se tiver dois objetos ele vai percorrer pelos index 0 e 1. 
        E com isso está vendo se o id do objeto é igual ao o id que foi fornecido, 
        ou seja, se o id fornecido for 2 ele vai retornar o index do objeto cujo o seu id é 2. 
      */

      indexTodo = taskList.findIndex((todo) => {
        return todo.id == id;
      });

      console.log(
        "Index do objeto que tem o id igual ao da tarefa em que o usuário clicou duas vezes:",
        indexTodo
      );


      const dataEdit = taskList[indexTodo];

      // Preenchendo os campos do modal com os valores da tarefa existente
      idInput.value = dataEdit.id; // id para controle de edição
      nameTodoInput.value = dataEdit.todo;
      deadlineInput.value = dataEdit.deadline;
      priorityInput.value = dataEdit.priority;
    }
  });
}

const openModal = () => {
  modalContainer.classList.add("modal-show");

  titleBox.innerText = "Nova Tarefa";
  btnAddTodo.style.display = "block";
  btnEditTodo.style.display = "none";
};

//Guardando as tarefas editadas dentro de um novo objeto
const editTask = () => {
  console.log("Editando tarefa com ID:", idInput.value);

  const taskEdit = {
    //Passando o valor do idInput para Número, pois ele está sendo salvo após editar como uma string
    id: Number(idInput.value),
    deadline: deadlineInput.value,
    todo: nameTodoInput.value,
    priority: priorityInput.value,
    category: categoryInput.value,
  };

  //Substituindo o objeto editado pelo novo objeto
  taskList[indexTodo] = taskEdit;

  console.log(taskList);
  //Pegando os objetos dentro do array taskList e armazendo em forma de string para o localStorage sob a chave tasks
  localStorage.setItem("tasks", JSON.stringify(taskList));

  closeModal();
  createCardTodo();
};

//Função que fecha o modal
const closeModal = () => {
  modalContainer.classList.remove("modal-show");
  idInput.value = "";
  nameTodoInput.value = "";
  deadlineInput.value = "";
};

//Função que verifica se a data está no passado com a biblioteca moment.js
function checkDateTodo(formattedDate, dateTodoSpan) {
  //Trasnformando o formattedDate em um objeto, já que ele é uma string
  const formattedMoment = moment(formattedDate, "DD/MM/YYYY");

  //Pegando a data atual
  const currentDate = moment();

  //Pegando a diferença de dias entre a data atual e a data que o usuário colocou no input
  //O método diff serve para pegar essa diferença e 'day' é a diferença que a gente quer pegar
  const diffInDays = formattedMoment.diff(currentDate, "days");

  //Verificando se a data está no passado ou na data atual
  if (diffInDays < 0) {
    dateTodoSpan.classList.add("date-past");
  }
}

//Função que deleta as tarefas
function delTodoCard(trashIcon, cardTodo, id) {
  trashIcon.addEventListener("click", () => {
    cardTodo.remove();
    console.log("id do objeto que está sendo deletado", id);

    //Percorrendo cada objeto para ver qual tem o id igual ao id do objeto deletado
    const indexTodo = taskList.findIndex((todo) => {
      return todo.id == id;
    });

    //Removendo o objeto em que o id é igual ao do objeto deletado
    taskList.splice(indexTodo, 1);
    console.log(taskList);

    //Pegando os os objetos que tem o id diferente do id que foi deletado e salvando no localStorage
    const todoFilter = taskList.filter((todo) => todo.id !== id);
    localStorage.setItem("tasks", JSON.stringify(todoFilter));
  });
}

//Eventos
btnAddTodo.addEventListener("click", (e) => {
  if (
    nameTodoInput.value == "" ||
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

//Percorrendo cada botão e adicionando um evento de click
btnCreateTodo.forEach((button) => {
  button.addEventListener("click", (event) => {
    //Pegando a div de coluna mais próxima atráves do alvo de onde ocorreu o click
    const column = event.target.closest(".column");

    //Pegando o valor do atributo data-column da coluna
    const dataColumn = column.getAttribute("data-column");
    console.log(dataColumn)

    //Colocando o valor do input de categoria de acordo com a coluna que o usuário clicou
    categoryInput.value = dataColumn;

    openModal();
  });
});

btnEditTodo.addEventListener("click", () => {
  editTask();
  closeModal();
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

modalContainer.addEventListener("click", (e) => {
  if (boxModal.contains(e.target)) return;
  closeModal();
});

// Parte dragg and drop

// Adiciona os manipuladores de eventos para todas as colunas e cards
const columns = document.querySelectorAll(".column");
columns.forEach((column) => {
  column.addEventListener("drop", dropHandler);
  column.addEventListener("dragover", dragOverHandler);

  const cards = column.querySelectorAll(".card-todo");
  cards.forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      // Obtém os dados da tarefa associada ao card
      const cardId = card.id.split("-")[1];
      const taskData = taskList.find((task) => task.id == cardId);

      // Inicia o processo de arrastar
      dragstartHandler(event, taskData);
    });
  });
});
