const show = localStorage.getItem("showName")
const list = document.querySelector(".list")

//增加todo
const save = document.querySelector(".btn_add")
const inputData = document.querySelector("#inputText")
let data = []
save.addEventListener("click", saveData)
function saveData() {
  if (inputData.value.trim() === "") {
    return
  }
  else {
    axios.post(`https://todoo.5xcamp.us/todos`,
      {
        "todo": {
          "content": inputData.value
        }
      }, {
      "headers": {
        "Authorization": localStorage.getItem("token")
      }
    }
    )
      .then(() => {
        queryTodo()
        inputData.value = ""
      })
  }
}
//優化
inputData.addEventListener("keyup", inputEnter)
function inputEnter(e) {
  if (e.key === "Enter") {
    saveData()
  }
}


// 炫染
function renderData(render) {
  let str = ""
  render.forEach(item => {
    if (item.completed_at === null) {
      str += `<li data-num="${item.id}">
      <label class="checkbox" for="">
        <input type="checkbox"/>
        <span>${item.content}</span>
      </label>
      <a href="#" class="delete"></a>
    </li>`
    }
    else {
      str += `<li data-num="${item.id}">
      <label class="checkbox" for="">
        <input type="checkbox" checked/>
        <span>${item.content}</span>
      </label>
      <a href="#" class="delete"></a>
    </li>`
    }
  }
  )
  list.innerHTML = str
}

//刪除＆切換
list.addEventListener("click", delData)

function delData(e) {
  e.preventDefault()
  let todoIndex = data.findIndex(item => {
    return item.id === e.target.closest("li").dataset.num
  })
  if (e.target.classList.contains("delete")) {
    axios.delete(`https://todoo.5xcamp.us/todos/${data[todoIndex].id}`, {
      "headers": {
        "Authorization": localStorage.getItem("token")
      }
    })
      .then(sus => {
        console.log(sus)
        queryTodo()
      })
      .catch(Error => {
        console.log(Error)
      }
      )
  }
  else {
    axios.patch(`https://todoo.5xcamp.us/todos/${data[todoIndex].id}/toggle`, {}, {
      "headers": {
        "Authorization": localStorage.getItem("token")
      }
    })
      .then(sus => {
        console.log(sus)
        queryTodo()
      })
      .catch(err => {
        console.log(err)
      })
  }
}

//切換tab狀態
const tab = document.querySelector(".tab")
const tabData = document.querySelectorAll(".tab li")
let render = ""
let tabStatus = "all"
tab.addEventListener("click", changeTab)
function changeTab(e) {
  tabStatus = e.target.dataset.tab
  tabData.forEach(item => {
    item.classList.remove("active")
  })
  if (tabStatus === "all") {
    e.target.classList.add("active")
  }
  else if (tabStatus === "work") {
    e.target.classList.add("active")

  }
  else if (tabStatus === "done") {
    e.target.classList.add("active")

  }
  updateData()
}

//不同tab狀態產生數據
function updateData() {
  if (tabStatus === "all") {
    render = data
  }
  else if (tabStatus === "work") {
    render = data.filter(item => {
      return item.completed_at === null
    })
  }
  else if (tabStatus === "done") {
    render = data.filter(item => {
      return item.completed_at !== null
    })
  }
  renderData(render)
  caicWork()
  showList()
}

//計算未完成數量
const workNum = document.querySelector("#workNum")
let work
function caicWork() {
  work = data.filter(item => {
    return item.completed_at === null
  })
  workNum.textContent = work.length
}

//清除已完成項目
const removeData = document.querySelector("#removeData")
removeData.addEventListener("click", remove)
function remove(e) {
  let removeALl = []
  e.preventDefault()
  let doneData = data.filter(item => {
    return item.completed_at !== null
  })
  doneData.forEach(item => {
    removeALl.push(axios.delete(`https://todoo.5xcamp.us/todos/${item.id}`, {
      "headers": {
        "Authorization": localStorage.getItem("token")
      }
    }))
    Promise.all(removeALl)
      .then(() => {
        queryTodo()
      })
      .catch((Error) => {
        console.log(Error)
      }
      )
  })

}

//顯示清單
const cardList = document.querySelector("#cardList")
const cardImg = document.querySelector("#cardImg")

function showList() {
  if (data.length > 0) {
    cardList.classList.remove("card_list")
    cardImg.style.display = "none"
  }
  else {
    cardList.classList.add("card_list")
    cardImg.style.display = ""
  }
}

//登出
const logout = document.querySelector(".logout")
logout.addEventListener("click", signout)
function signout() {
  const token = localStorage.getItem("token")
  axios.delete(`${url}sign_out`, {
    "headers": {
      "Authorization": token
    }
  })
    .then(sus => {
      console.log(sus)
      Swal.fire({
        title: "登出成功",
        icon: "success",
      })
        .then(() => {
          goToIndex()
        })
    })
    .catch(Error => {
      console.log(Error)
      Swal.fire({
        title: "登出失敗",
        icon: "error",
      })
        .then(() => {
          goToIndex()
        })
    })
}
//登出回到首頁
function goToIndex() {
  window.location.href = 'index.html'
}

//dom載入完成時執行查詢todo&顯示名子
window.onload = function () {

  queryTodo()
  todoName()
}
//顯示名子到右上角
const changeName = document.querySelector(".changeName")
function todoName() {
  changeName.textContent = localStorage.getItem("showName")
}

//查詢todo
function queryTodo() {
  axios.get("https://todoo.5xcamp.us/todos", {
    "headers": {
      "Authorization": localStorage.getItem("token")
    }
  })
    .then(item => {
      data = item.data.todos
      updateData()

    })
    .catch(err => {
      console.log(err)
    })
}
