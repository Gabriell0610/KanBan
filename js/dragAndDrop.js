import { taskList, createCardTodo } from "./scripts.js";

//Drag and Drop
export const dragstartHandler = (event, data) => {
    console.log(event);
    event.dataTransfer.setData("text/plain", JSON.stringify(data.id));
};
  
// Função para lidar com o evento de soltar (drop)
export const dropHandler = (event) => {
    event.preventDefault();
  
    // Obter o ID da tarefa do texto simples armazenado durante o evento de arrastar
    const taskId = event.dataTransfer.getData("text/plain");
  
    // Obter a coluna de destino
    const dropColumn = event.target.closest(".column");
  
    if (dropColumn && taskId) {
      // Definir a nova categoria da tarefa com base na coluna de destino
      const newCategory = dropColumn.getAttribute("data-column");
  
  
      // Atualizar a categoria da tarefa no array
      const taskIndex = taskList.findIndex((task) => task.id == taskId);
      taskList[taskIndex].category = newCategory;
  
      //Pegando os objetos dentro do array taskList e armazendo em forma de string para o localStorage sob a chave tasks
      localStorage.setItem("tasks", JSON.stringify(taskList));
  
      // Atualizar o conteúdo visual (recriar os cards)
      createCardTodo();
    }
};
  
// Função para lidar com o evento de arrastar sobre a coluna
export const dragOverHandler = (event) => {
    event.preventDefault();
};

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