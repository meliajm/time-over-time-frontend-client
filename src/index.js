let tasks = []
const categoryNames = []

let addTask = false
// const colorObj = {1: 'dodger', 2: 'blue', 11: 'royal', 14: 'sky', 15: 'selective', 16: 'sandstorm', 17: 'minion', 18: 'flavescent'}
const colorObj = {1: 'dodger', 2: 'blue', 3: 'royal', 4: 'sky', 5: 'selective', 6: 'sandstorm', 7: 'minion', 8: 'flavescent'}

const daysObj = {0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday'}

const main = document.getElementById('main')
const addTaskButton = document.querySelector('#new-task-button')
const taskForm = document.querySelector('.container')
const getFormInfo = document.querySelector('.add-task-form')
const getTaskList = document.querySelector('div.task-list')


const getTaskContent = () => document.getElementById('content').value 
const getCategoryName = () => document.getElementById('category').value

document.addEventListener('DOMContentLoaded', function () {
    init()
    getAllCategories()
    getFormInfo.addEventListener('submit', Task.createNewTask)
    
  })

function init() {
    
    Auth.getCurrentUser()
    .finally(function() {
        loadMain()
        attachListenerToMain()
        attachListenerToNav()
        Task.getTasks()

    })
    console.log('mmm----------')
    console.log(`cu: ${Auth.currentUser.email}`)
    console.log(Auth.currentUser)    
}

function loadMain() {
    Nav.resetNav()    
}

function attachListenerToMain() {
    main.addEventListener('click', handleBodyClick)
}

function attachListenerToNav() {
    const nav = document.getElementById('nav')
    nav.addEventListener('click', handleBodyClick)
}

function handleBodyClick(e) {
    e.preventDefault()
    switch (e.target.className) {
        case "auth-form":
            handleClick(e)
            break
        case "logout-button":
            handleClick(e)
            break 
        case "signup-form":
            handleClick(e)
            break 
        default:
            console.log(e.target)
        }
    }
    
function handleClick(e) {
    switch (e.target.id) {
        case 'login-form':
            Auth.handleLogin()
            break
        case 'logout':
            Auth.logout()
            break
        case 'signup-form-submit':
            Auth.handleSignup()
            break 
    default:
        console.log(e.target)
    }
}

addTaskButton.addEventListener("click", () => {
    toggleNewFormButton()
});

function renderCirlce(percentCompleted) {
    const ptag = document.getElementById('top-doc')
    ptag.insertAdjacentHTML('afterend', circle(percentCompleted))
}

function circle(percentCompleted) {
    
    return `<div class="square">
    <text class="text-completed">Completed</text>
    <svg x="45" y="45" viewBox="0 0 36 36" class="circular-chart">
    <path class="circle"
    stroke-dasharray="${percentCompleted}, 100"
    
    d="M18 2.0845
    a 15.9155 15.9155 0 0 1 0 31.831
    a 15.9155 15.9155 0 0 1 0 -31.831"
    />
    <text x="18" y="20.35" class="percentage">${parseInt(percentCompleted)}%</text>
    </svg>
    </div>`

}

function updateRenderedCircle(percentCompleted) {

    const circleElm = document.querySelector('.circle')
    const circleTextElm = document.querySelector('.percentage')
    
    if (percentCompleted === 0) {
        circleElm.style.strokeDasharray='0, 100'
        console.log(parseInt(percentCompleted))
        console.log('update rendered circle a')
    }
    
    else {
        circleElm.style.strokeDasharray=`${percentCompleted}, 100`
        console.log(parseInt(percentCompleted))
        console.log('update rendered circle b')
    }
    circleTextElm.innerHTML = `${parseInt(percentCompleted)}%`
}
    
// new task form display
function getAllCategories() {
    Api.get('/categories')
      .then(function (json) {
        json.forEach(cat => categoryNames.push(cat))
        return unique(categoryNames)
      })
      .then(function(categories) {
          makeDropDownListOfCategories(categories)
      })
      .catch(errors => console.log(errors));
}

function makeDropDownListOfCategories(cats) {
    const selectElem = document.createElement('select')
    selectElem.classList.add('input-text')
    selectElem.id = 'category'
    getFormInfo.appendChild(selectElem)
    const option = document.createElement('option')
    option.disabled = 'disabled'
    option.selected = 'selected' 
    option.innerHTML = 'Choose your category'
    selectElem.appendChild(option)

    cats.forEach( cat => {
        const optionElem = document.createElement('option')
        optionElem.value = cat.name
        optionElem.innerHTML = cat.name
        selectElem.appendChild(optionElem)
    })
    const inputSubmit = document.createElement('input')
    inputSubmit.type = 'submit'
    inputSubmit.name = 'name'
    inputSubmit.value = 'Create'
    inputSubmit.classList.add('submit')
    inputSubmit.id = 'task-form'
    const brk = document.createElement('br')
    getFormInfo.appendChild(brk)
    getFormInfo.appendChild(inputSubmit)
}

function unique(array) {
    let arrA = []
    for (let i=0; i<array.length; i++) {
      if (!arrA.includes(array[i])) {
        arrA.push(array[i])
      } 
    }
    return arrA
}

function toggleNewFormButton() {
    addTask = !addTask;
      if (addTask) {
        taskForm.style.display = "block";
      } else {
        taskForm.style.display = "none";
      }
}

function clearNewTaskForm() {
    const inputTextAll = document.querySelectorAll(".input-text")
    inputTextAll.forEach( inputText => inputText.value = "")
}

function clearAuthForm() {
    const inputTextAll = document.querySelectorAll(".auth-form-input")
    inputTextAll.forEach( inputText => inputText.value = "")   
}

