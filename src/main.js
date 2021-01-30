"use strict";

//basic variables
const addBtn = document.querySelector('#add-button');
const textInput = document.querySelector('#text-input');
const prioritySelector = document.querySelector('#priority-selector');
const ulList = document.querySelector('ul');
const sortBtn = document.querySelector('#sort-button');
let counterTitle = document.querySelector('#counter');
let counterText = document.querySelector('#counter-text');
let counter = 0;
let arrOfObjTasks = [];
let arrOfDeletedTodo = [];

//event listeners
document.addEventListener('DOMContentLoaded', getTasksFromJSONBin);
addBtn.addEventListener('click', addTodo);
sortBtn.addEventListener('click', sortTodoList);

//add todo item
function addTodo (e) {
    let inputValue = textInput.value;
    if (inputValue != "") {
        textInput.value = '';  //reset the input line
        const todoContainer = document.createElement('div');  //todo task container in div
        const todoPriority = document.createElement('div');  //todo priority in div
        const todoCreatedAt = document.createElement('div');  //time to do created in div
        const todoText = document.createElement('div');  //todo task text in div
        const deleteBtn = document.createElement('button');  //delete button 
        const checkBtn = document.createElement('input');  //checkbox

        todoContainer.className = 'todo-container';
        todoText.className = 'todo-text';
        todoCreatedAt.className = 'todo-created-at';
        todoPriority.className = 'todo-priority';
        deleteBtn.className = 'delete-button';
        checkBtn.className = 'check-button';

        let date = new Date();
        let dateSQLFormat = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        todoCreatedAt.innerText = dateSQLFormat;

        todoText.innerText = inputValue;
        todoPriority.innerText = prioritySelector.value;
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        checkBtn.setAttribute('type', 'checkbox');

        const taskObj = {
            text: inputValue,
            priority: prioritySelector.value,
            taskCreatedAt: dateSQLFormat
        }
        arrOfObjTasks.push(taskObj);

        todoContainer.append(todoPriority, todoText, todoCreatedAt, checkBtn, deleteBtn);
        ulList.append(todoContainer);
        counter++;

        deleteBtn.addEventListener('click', deleteTodo);
        checkBtn.addEventListener('click', checkTask);

        prioritySelector.value = 1;
    } else {
        alert('WRITE A TASK!');
    }
    textInput.focus();
    counterTasks(counter);
    updateTaskToJSONBin();
}

//function to delete tasks
function deleteTodo (e) {
    let item = e.target.parentElement;
    const deletedTask = {
        text: item.querySelector('.todo-text').innerHTML,
        priority: item.querySelector('.todo-priority').innerText,
        taskCreatedAt: item.querySelector('.todo-created-at').innerText
    }
    arrOfDeletedTodo.push(deletedTask);
    const deletedObj = item.querySelector('.todo-created-at').innerText;
    arrOfObjTasks = arrOfObjTasks.filter(taskObj => taskObj.taskCreatedAt != deletedObj);
    item.remove();

    counter--;
    counterTasks(counter);
    textInput.focus();

    updateTaskToJSONBin();
}


//function to sort the todo list by priority
function sortTodoList (e) {
    let arrOfPriority = document.querySelectorAll('.todo-priority');
    let sortArr = [];
    for (let i = 1; i <= 5; i++) {
        for (let j = 0; j < arrOfPriority.length; j++) {
            if (i.toString() === arrOfPriority[j].innerText) {
                sortArr.push(arrOfPriority[j].parentElement);
                ulList.removeChild(arrOfPriority[j].parentElement);
            }
        }
    }
    for (let k = sortArr.length - 1; k >= 0; k--) {
        ulList.appendChild(sortArr[k]);
    }
}

//function to count how much tasks you have 
function counterTasks (count) {
    if (count === 0) {
        counterTitle.innerHTML = 'No Tasks To Do';
        counterText.innerText = '';
    } else {
        counterTitle.innerHTML = `${count}`;
        counterText.innerText = 'Tasks To Do';
    }
}

//function to update tasks in JSONBIN
async function updateTaskToJSONBin () {
    fetch('https://api.jsonbin.io/v3/b/6012f2cc050e9474fe36b1e8', {
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json',
    'X-Master-Key': '$2b$10$3c8HlT7Mkm6Fmhp4/y0UveKGq8qFaFdTiTNKewqhEuXpQ9l7Itxdm',
  },
    body: JSON.stringify({"my-todo": arrOfObjTasks}) 
})
}

//function to get tasks from JSONBIN   
async function getTasksFromJSONBin() {
    let response = await fetch("https://api.jsonbin.io/v3/b/6012f2cc050e9474fe36b1e8", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": "$2b$10$3c8HlT7Mkm6Fmhp4/y0UveKGq8qFaFdTiTNKewqhEuXpQ9l7Itxdm",
      },
    });
    let data = await response.json();
    arrOfObjTasks = data.record["my-todo"];
    insertTasksFromJSONBINToHtml();
}

//function to insert data from JSONBIN to HTML
function insertTasksFromJSONBINToHtml () {
    for (let i = 0; i < arrOfObjTasks.length; i++) {
        const todoContainer = document.createElement('div');  //todo task container in div
        const todoPriority = document.createElement('div');  //todo priority in div
        const todoCreatedAt = document.createElement('div');  //time to do created in div
        const todoText = document.createElement('div');  //todo task text in div
        const deleteBtn = document.createElement('button');
        const checkBtn = document.createElement('input');  //checkbox

        todoContainer.className = 'todo-container';
        todoText.className = 'todo-text';
        todoCreatedAt.className = 'todo-created-at';
        todoPriority.className = 'todo-priority';
        deleteBtn.className = 'delete-button';
        checkBtn.className = 'check-button';

        todoPriority.innerText = arrOfObjTasks[i].priority;
        todoText.innerText = arrOfObjTasks[i].text;
        todoCreatedAt.innerText = arrOfObjTasks[i].taskCreatedAt;
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        checkBtn.setAttribute('type', 'checkbox');
        
        todoContainer.append(todoPriority, todoText, todoCreatedAt, checkBtn, deleteBtn);
        ulList.appendChild(todoContainer);
        deleteBtn.addEventListener ('click', deleteTodo);
        checkBtn.addEventListener('click', checkTask);

        counterTasks(arrOfObjTasks.length);
        counter = arrOfObjTasks.length;
    }
    textInput.focus();
}

function checkTask (e) {
   const complete = e.target.parentElement;
   complete.classList.toggle('completed');
   textInput.focus();
}