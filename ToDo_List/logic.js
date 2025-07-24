const todoValue = document.getElementById('todo-text');
const addTask = document.getElementById('add-task');
const todoAlert = document.getElementById('alert');
const listItems = document.getElementById('list-items');
const logo = document.getElementById('logo')
let updatedText= null;
const toggleBtn = document.getElementById('mode-toggle');


toggleBtn.addEventListener("click", () =>{
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    const themeSettings = {
        mode : isDark ? 'dark' : 'light',
        logo: isDark ?  'images/dark-logo.svg' : 'images/light-logo.svg'
    }
    isDark ?  toggleBtn.title = 'Enable Dark Mode' : toggleBtn.title = 'Enable Dark Mode';;
    localStorage.setItem('theme-settings' ,JSON.stringify(themeSettings));
    
    toggleBtn.innerText = isDark ? '☀️' : '🌙';
    logo.src = themeSettings.logo
    
})

const saved = localStorage.getItem('theme-settings');
if(saved){
    const settings = JSON.parse(saved);

    if(settings.mode == 'dark'){
        document.body.classList.add('dark-mode');
        toggleBtn.innerText = '☀️'
        toggleBtn.title = 'Enable Light Mode';
    }else{
        toggleBtn.innerText = '🌙';
        toggleBtn.title = 'Enable Dark Mode';
    }
    logo.src = settings.logo;
}

let todo = JSON.parse(localStorage.getItem("todo-list"));
if(!todo){
    todo = [];
}
function setLocalStorage(){
    localStorage.setItem("todo-list" ,JSON.stringify(todo));
}

function setMessage(message) {
    todoAlert.removeAttribute("class");
    todoAlert.innerText = message;

    setTimeout(() =>{
        todoAlert.classList.add("toggleMe");
    },1000);
}

//create task
function createTask(){

    
    if(todoValue.value.trim() === ''){
        todoAlert.innerText = 'Please add a task!'
        todoValue.focus();
        return;
    }else{
        isPresent = false;
        todo.forEach(element => {
            if(element.item == todoValue.value.trim()){
                isPresent = true;
            }
        });
        if(isPresent){
            setMessage('This Task is alrady present');
            return;
        }
        if(!todo){
            todo = [];
        }
        
        let itemtList = {
            item: todoValue.value,
            status: false
        }
        todo.push(itemtList);
        setLocalStorage();  
        readTask();
        
    }
    setMessage('Task Created Sucessfully!!');
    todoValue.value = '';
}


//show the task

function readTask(){
    listItems.innerHTML = '';

    todo.forEach((element) =>{
        let li = document.createElement('li');
        let style = element.status ? "style='text-decoration: line-through'" : "";
        const taskItem = `
            <div ${style} class="task" ondblclick = "CompletedToDoTasks(this)" title = "hit double click to complete the task">${element.item}</div>
            <div class="task-controls">
                <div class="edit task-control" onclick="updateTask(this)" ><span>&#9998</span></div>
                <div class="delete task-control" onclick="deleteTask(this)"><span>&#10006</span></div>
            </div>
        `
        li.innerHTML = taskItem;
        listItems.append(li)
    });
}


function updateTask(e){
    const li = e.closest('li')
    const taskText = li.querySelector('div[dblclick]') || li.querySelector('div[title]');

    if(taskText && taskText.style.textDecoration == ''){
        todoValue.value = taskText.innerText.trim();
        updatedText = taskText.innerText.trim();
        addTask.setAttribute('onclick','updateOnSelected()')
        todoValue.focus();
    }
}

function updateOnSelected(){
    let isPresent = false;
    let newTask = todoValue.value.trim();

    if(newTask == ''){
        setMessage( 'This Task cannot be empty');
        return;
    }

    todo.forEach((element) =>{
        if(element.item == todoValue.value){
            isPresent = true;
        }
    })

    if(isPresent){
        setMessage( 'This Task is already on the list');
        return;
    }

    todo.forEach((element) =>{
        if(element.item == updatedText){
            element.item = newTask;
        }
    })

    setLocalStorage();
    readTask();

    addTask.setAttribute('onclick' ,'createTask()');
    todoValue.value = '';
    updatedText = null;

    todoAlert.innerText = 'Task updated sucessfully'

}

function deleteTask(e){
    let li = e.closest('li');
    let deletedTask = li.querySelector('div[ondblclick]')?.innerText || li.querySelector('div[title]').innerText ;

    if(confirm(`Do you want to delete this task: ${deletedTask}`)){
        let index = todo.findIndex(element => element.item === deletedTask.trim());

        if(index !== -1){
            todo.splice(index,1);
            setLocalStorage();
            li.classList.add("deleted");
            setTimeout(() =>{
                readTask();
            },500);
            setMessage('Task deleted sucessfully');
        }
        
    }
}

function CompletedToDoTasks(e){
    let li = e.closest('li');
    let taskDiv = li.querySelector('div[dblclick]') || li.querySelector('div[title]');

    if(taskDiv.style.textDecoration === ''){
        taskDiv.style.textDecoration = 'line-through';

        todo.forEach((element) =>{
            if(element.item == taskDiv.innerText.trim() ){
                element.status = true;
            }
        })

        setLocalStorage();
        readTask();
    }
}

window.onload = function () {
  readTask();
};