class Task {

  static all = []

  constructor(data) {
    this.id = data.id
    this.content = data.content
    this.category = data.category
    this.completed = data.completed
    this.get_date = data.get_date
    this.category_id = data.category_id
    this.user_id = data.user_id
    this.user = data.user
    this.save()
  }

  save() {
    if (Auth.currentUser.id === this.user_id) {
      Task.all.push(this)
    }
  }

  card(color) {
    return `
    <div class="card">
        <div class="card-content ${color}">
            <p><strong>${Formatter.titleize(this.content)}</strong></p>
            <p id="hide-complete">By when: </p>
            <p>${this.category.name}</p>
            <h5 id="hide-complete">Completed: ${this.completed} </h5>
            <button class="completed-button" data-id=${this.id}>Completed!</button>
            
            <button class="delete-button" data-id=${this.id}>x</button>
        </div>
    </div>
    <br>
    <br>`  
  }

  static renderTasks() {
    Task.all.forEach(task => task.render())
  }

  render() {
    const bigCard = document.getElementById(this.get_date) || Task.createBigCard(this.get_date)
    let color = colorObj[`${this.category_id}`]
    bigCard.insertAdjacentHTML('beforeend', this.card(color))
    const btns = document.querySelectorAll('.completed-button')
    btns.forEach(btn => btn.addEventListener('click', Task.completeTask))
    const deleteButtons = document.querySelectorAll('.delete-button')
    deleteButtons.forEach(button => button.addEventListener('click', Task.deleteTask))
    
    if (this.completed) {
      Task.renderCompleted(this)
    }    
  }
  
  static createBigCard(taskGetDate) {
    const taskMonth = taskGetDate.slice(0, 2)
    const monthCard = document.getElementById(taskMonth) || Task.createMonthCard(taskMonth)
    const bigCard = document.createElement('div')
    bigCard.id = taskGetDate
    bigCard.classList.add('big-card')
    monthCard.insertAdjacentElement('afterbegin', bigCard)
    Task.addWeekDayToBigCard(bigCard)
    return bigCard
  }

  static createMonthCard(taskMonth) {
    const monthCard = document.createElement('div')
    monthCard.id = taskMonth
    monthCard.classList.add('month-card')
    getTaskList.insertAdjacentElement('afterbegin', monthCard)
    Task.addMonthNameToMonthCard(monthCard)
    return monthCard
  }

  static addMonthNameToMonthCard(monthCard) {
    const monthsObj = {'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'June', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'}
    const h2 = document.createElement('h2')
    h2.classList = 'month-header'
    const monthName = monthCard.id 
    h2.innerText = monthsObj[monthName]
    monthCard.appendChild(h2) 
  }

  static addWeekDayToBigCard(bigCard) {
    const h = document.createElement('h5')
    const dayAsNum = (new Date(bigCard.id)).getDay()
    h.innerText = daysObj[`${dayAsNum}`]
    bigCard.insertAdjacentElement('afterbegin', h)
  }

  static createNewTask(e) {
    e.preventDefault()
    const categoryName = getCategoryName()
    const taskContent = getTaskContent()
    
    if (taskContent && categoryName !=='Choose your category') {
      let strongParams = {
        category: {name: categoryName},
        task: {
            content: Formatter.titleize(taskContent),
        }
      }
      Api.post('/tasks', strongParams)
      .then(data => {
        let task = new Task(data)
        task.render()
        
        clearNewTaskForm()
        toggleNewFormButton()
        Task.apiCallUpdateRenderedCircle()
      })
    } else {
      console.log("You need to pick a category and enter in a task's content")
    }
  }

  static apiCallUpdateRenderedCircle() {
    const completedTasksA = []
    const totalTasks = []
    Api.get('/tasks')
      .then(function (data) {
        data.forEach( task => Task.getArraysForRenderingCircle(task, completedTasksA, totalTasks))
      })
      .then(function() {
          if (completedTasksA.length === 0) {
            updateRenderedCircle(0)
          } else {
            updateRenderedCircle(completedTasksA.length / totalTasks.length * 100)
          }
      })
  }

  static getArraysForRenderingCircle(task, arrOne, arrTwo) {
    const completedTasksA = arrOne
    const totalTasks = arrTwo
    if (task.completed === true && task.user_id === Auth.currentUser.id) {
      completedTasksA.push(task)
    }
    if (task.user_id === Auth.currentUser.id) {
      totalTasks.push(task)
    }
  }

  static getTasks() {
    if (Auth.currentUser.email) {
      const completedTasksA = []
      const totalTasks = []
      Api.get('/tasks')
      .then(function (data) {
        data.forEach( task => {
          new Task(task)
          Task.getArraysForRenderingCircle(task, completedTasksA, totalTasks)
        })
        Task.renderTasks()
        if (Task.all.length === 0) {
          renderCirlce(0)
        } else {
          renderCirlce(completedTasksA.length / totalTasks.length * 100)
        }
        console.log(completedTasksA)
        console.log(totalTasks)
      })
      .then(function () {
      })
      .catch(errors => console.log(errors))
    } else {
      Task.clearTasksFromDom()
    }
  }

  static clearTasksFromDom() {
    const divTaskList =  document.querySelector('.task-list')
    divTaskList.innerHTML = ''
  }

  static clearDivSquare() {
    const divSquare = document.querySelector('div.square')
    divSquare.innerHTML = ""
  }

  static deleteTask(event) {
    const eventID = event.target.dataset.id 
    Api.delete(`/tasks/${eventID}`)
    .then(function () {
        const allDeleteButtons = document.querySelectorAll('.delete-button')
        allDeleteButtons.forEach( delBtn => {
          if (delBtn.dataset.id === eventID) {
            delBtn.parentNode.remove()
          }
        })      
      Task.apiCallUpdateRenderedCircle()      
    })
  }

  static completeTask(event) {
    const eventID = event.target.dataset.id
    Api.patch(`/tasks/${eventID}`, {
        "completed": true
        }
      )
      .then(function (json) {
        Task.renderCompleted(json)
      })
      .then(function() {
        Task.apiCallUpdateRenderedCircle()
      })
      .catch(errors => console.log(errors))
  }
  
  static renderCompleted(json) {
    const allCompletedButtons = document.querySelectorAll('.completed-button')
    allCompletedButtons.forEach( completedBtn => {
      if (parseInt(completedBtn.dataset.id) === json.id) {
        Task.colorTask(json, completedBtn)
      }
    })
  }

  static colorTask(json, button) {
    button.classList.add(`completed-task-${colorObj[json.category_id]}`)
  }
  

}