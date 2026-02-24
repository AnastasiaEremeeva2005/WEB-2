(function () {
  'use strict'

  var tasks = []
  var STORAGE_KEY = 'todoListTasks'

  function initFavicon() {
    var link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/png'
    link.href = 'images/favicon.png'
    document.head.appendChild(link)
  }

  // подключаем стили через js
  function initStyles() {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'styles.css'
    document.head.appendChild(link)
  }

  function createEl(tag, text, className) {
    var el = document.createElement(tag)
    if (text) el.textContent = text
    if (className) el.className = className
    return el
  }

  function deleteError(textContent) {
    var errorSpan = document.body.querySelector('#errorSpan')
    var text = textContent != null ? String(textContent).trim() : ''
    if (errorSpan && errorSpan.classList.contains('visible') && text.length > 0) {
      errorSpan.classList.remove('visible')
      errorSpan.textContent = ''
    }
  }

  function createForm() {
    var createFormDiv = document.createElement('div')
    createFormDiv.className = 'todo-flex-container'
    createFormDiv.id = 'todoFormContainer'

    var createFormTittle = document.createElement('p')
    createFormTittle.textContent = 'Добавить задачу'
    createFormTittle.className = 'todo-form-tittle'

    var form = document.createElement('form')
    form.className = 'todo-form'
    form.id = 'todoForm'

    var inputText = document.createElement('input')
    inputText.type = 'text'
    inputText.placeholder = 'Название задачи (до 60 символов)'
    inputText.id = 'taskTitle'
    inputText.maxLength = 60
    inputText.addEventListener('input', function () {
      deleteError(inputText.value)
    })

    var inputDate = document.createElement('input')
    inputDate.type = 'date'
    inputDate.id = 'taskDate'

    var btn = document.createElement('button')
    btn.type = 'submit'
    btn.textContent = 'Добавить'

    var errorSpan = document.createElement('span')
    errorSpan.className = 'error-span'
    errorSpan.id = 'errorSpan'
    
    form.append(inputText, inputDate, btn)
    createFormDiv.append(createFormTittle, form, errorSpan)
    return createFormDiv
  }

  function createControls() {
    var createControlsDiv = document.createElement('div')
    createControlsDiv.className = 'todo-flex-container'
    createControlsDiv.id = 'todoControlsContainer'

    var createControlsTittle = document.createElement('p')
    createControlsTittle.textContent = 'Фильтры'
    createControlsTittle.className = 'todo-form-tittle'

    var wrap = document.createElement('div')
    wrap.className = 'todo-controls'

    var search = document.createElement('input')
    search.type = 'text'
    search.placeholder = 'Поиск по названию'
    search.id = 'searchInput'

    var filter = document.createElement('select')
    filter.id = 'filterSelect'
    filter.className = 'custom-select-native'
    var all = document.createElement('option')
    all.value = 'all'
    all.textContent = 'Все'
    var done = document.createElement('option')
    done.value = 'done'
    done.textContent = 'Выполненные'
    var notDone = document.createElement('option')
    notDone.value = 'notDone'
    notDone.textContent = 'Невыполненные'
    filter.append(all, done, notDone)

    var customSelectWrap = document.createElement('div')
    customSelectWrap.className = 'custom-select'
    customSelectWrap.style.minWidth = '160px'
    customSelectWrap.appendChild(filter)

    var selectedDiv = document.createElement('div')
    selectedDiv.className = 'custom-select-selected'
    var selectedText = document.createElement('span')
    selectedText.className = 'custom-select-selected-text'
    selectedText.textContent = filter.options[filter.selectedIndex].textContent
    var arrowImg = document.createElement('img')
    arrowImg.src = 'icons/arrow.svg'
    arrowImg.alt = ''
    arrowImg.className = 'custom-select-arrow'
    selectedDiv.appendChild(selectedText)
    selectedDiv.appendChild(arrowImg)
    customSelectWrap.appendChild(selectedDiv)

    var itemsDiv = document.createElement('div')
    itemsDiv.className = 'custom-select-items custom-select-hide'
    for (var i = 0; i < filter.options.length; i++) {
      var optDiv = document.createElement('div')
      optDiv.textContent = filter.options[i].textContent
      optDiv.dataset.index = String(i)
      if (i === filter.selectedIndex) optDiv.classList.add('custom-select-item-active')
      itemsDiv.appendChild(optDiv)
    }
    customSelectWrap.appendChild(itemsDiv)

    wrap.append(search, customSelectWrap)
    createControlsDiv.append(createControlsTittle, wrap)
    return createControlsDiv
  }

  function closeAllSelect(exceptSelected) {
    var items = document.querySelectorAll('.custom-select-items')
    var selected = document.querySelectorAll('.custom-select-selected')
    var keepOpenItems = exceptSelected && exceptSelected.nextElementSibling
    for (var i = 0; i < selected.length; i++) {
      if (selected[i] !== exceptSelected) {
        selected[i].classList.remove('custom-select-arrow-active')
      }
    }
    for (var j = 0; j < items.length; j++) {
      if (items[j] !== keepOpenItems) {
        items[j].classList.add('custom-select-hide')
      }
    }
  }

  function initCustomSelect() {
    var wrap = document.querySelector('.custom-select')
    if (!wrap) return
    var sel = wrap.querySelector('select')
    var selectedDiv = wrap.querySelector('.custom-select-selected')
    var itemsDiv = wrap.querySelector('.custom-select-items')
    if (!sel || !selectedDiv || !itemsDiv) return

    selectedDiv.addEventListener('click', function (e) {
      e.stopPropagation()
      closeAllSelect(this)
      itemsDiv.classList.toggle('custom-select-hide')
      selectedDiv.classList.toggle('custom-select-arrow-active')
    })

    var optionDivs = itemsDiv.querySelectorAll('div')
    for (var i = 0; i < optionDivs.length; i++) {
      optionDivs[i].addEventListener('click', function (e) {
        var idx = Number(this.dataset.index)
        sel.selectedIndex = idx
        selectedDiv.querySelector('.custom-select-selected-text').textContent = this.textContent
        for (var k = 0; k < optionDivs.length; k++) {
          optionDivs[k].classList.remove('custom-select-item-active')
        }
        this.classList.add('custom-select-item-active')
        itemsDiv.classList.add('custom-select-hide')
        selectedDiv.classList.remove('custom-select-arrow-active')
        sel.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }

    document.addEventListener('click', function () {
      closeAllSelect(null)
    })
  }

  function createTaskItem(task) {
    var li = document.createElement('li')
    li.className = 'todo-item'
    if (task.done) li.classList.add('done')
    li.dataset.id = String(task.id)
    li.draggable = true

    var textSpan = document.createElement('span')
    textSpan.className = 'todo-item-text'
    textSpan.textContent = task.title

    var dateSpan = document.createElement('span')
    dateSpan.className = 'todo-item-date'
    dateSpan.textContent = task.date || '—'

    var actions = document.createElement('div')
    actions.className = 'todo-item-actions'

    function iconImg(src, alt) {
      var img = document.createElement('img')
      img.src = src
      img.alt = alt
      img.className = 'todo-btn-icon'
      return img
    }

    var btnDone = document.createElement('button')
    btnDone.type = 'button'
    btnDone.className = 'btn-done'
    var doneLabel = task.done ? 'Отменить' : 'Готово'
    btnDone.title = doneLabel
    btnDone.appendChild(iconImg(task.done ? 'icons/cancel.svg' : 'icons/confirm.svg', doneLabel))

    var btnEdit = document.createElement('button')
    btnEdit.type = 'button'
    btnEdit.className = 'btn-edit'
    btnEdit.title = 'Изменить'
    btnEdit.appendChild(iconImg('icons/pencil.svg', 'Изменить'))

    var btnDelete = document.createElement('button')
    btnDelete.type = 'button'
    btnDelete.className = 'btn-delete'
    btnDelete.title = 'Удалить'
    btnDelete.appendChild(iconImg('icons/trash.svg', 'Удалить'))

    actions.append(btnDone, btnEdit, btnDelete)
    var row = document.createElement('div')
    row.className = 'todo-item-row'
    row.append(textSpan, actions)
    li.append(dateSpan, row)

    return li
  }

  function renderEmpty(listEl) {
    var emptyBox = document.createElement('div')
    emptyBox.className = 'todo-empty'
    var emptyIcon = document.createElement('img')
    emptyIcon.src = 'icons/sad_face.svg'
    emptyIcon.alt = ''
    emptyIcon.className = 'todo-empty-icon'
    var emptyText = document.createElement('p')
    emptyText.className = 'todo-empty-text'
    emptyText.textContent = 'Тут ничего нет...'
    emptyBox.appendChild(emptyIcon)
    emptyBox.appendChild(emptyText)
    listEl.appendChild(emptyBox)
  }

  function renderTasks(listEl) {
    listEl.innerHTML = ''
    var filtered = getFilteredTasks()
    if (filtered.length === 0) {
      renderEmpty(listEl)
    } else {
      filtered.forEach(function (task) {
        listEl.appendChild(createTaskItem(task))
      })
    }
  }

  function getFilteredTasks() {
    var search = (document.getElementById('searchInput') || {}).value || ''
    var filter = (document.getElementById('filterSelect') || {}).value || 'all'
    var list = tasks.slice()

    if (filter === 'done') list = list.filter(function (t) { return t.done })
    if (filter === 'notDone') list = list.filter(function (t) { return !t.done })

    if (search.trim()) {
      var lower = search.trim().toLowerCase()
      list = list.filter(function (t) { return t.title.toLowerCase().indexOf(lower) !== -1 })
    }

    list.sort(function (a, b) {
      var d1 = a.date || ''
      var d2 = b.date || ''
      if (d1 !== d2) return d1.localeCompare(d2)
      var o1 = a.listNumber!= null ? a.listNumber: 0
      var o2 = b.listNumber!= null ? b.listNumber: 0
      return o1 - o2
    })

    return list
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.warn('Не удалось сохранить задачи', e)
    }
  }

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY)
      if (raw) tasks = JSON.parse(raw)
      if (!Array.isArray(tasks)) tasks = []
    } catch (e) {
      tasks = []
    }
  }

  function nextId() {
    var max = 0
    tasks.forEach(function (t) { if (t.id > max) max = t.id })
    return max + 1
  }

  function nextNumber() {
    var max = 0
    tasks.forEach(function (t) { if (t.listNumber!= null && t.listNumber> max) max = t.listNumber})
    return max + 1
  }

  function getTodayDate() {
    var d = new Date()
    var y = d.getFullYear()
    var m = String(d.getMonth() + 1).length === 1 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    var day = String(d.getDate()).length === 1 ? '0' + d.getDate() : d.getDate()
    return y + '-' + m + '-' + day
  }

  function addTask(title, date) {
    tasks.push({
      id: nextId(),
      title: title,
      date: date || getTodayDate(),
      done: false,
      listNumber: nextNumber()
    })
    saveTasks()
  }

  function deleteTask(id) {
    var numId = Number(id)
    tasks = tasks.filter(function (t) { return t.id !== numId })
    renumberList()
    saveTasks()
  }

  //пересчитываем номера после удаления, так как сбивается порядок
  function renumberList() {
    var sorted = tasks.slice().sort(function (a, b) {
      var d1 = a.date || ''
      var d2 = b.date || ''
      if (d1 !== d2) return d1.localeCompare(d2)
      var o1 = a.listNumber != null ? a.listNumber : 0
      var o2 = b.listNumber != null ? b.listNumber : 0
      return o1 - o2
    })
    sorted.forEach(function (t, i) {
      t.listNumber = i
    })
  }

  function toggleDone(id) {
    var numId = Number(id)
    var task = tasks.find(function (t) { return t.id === numId })
    if (task) {
      task.done = !task.done
      saveTasks()
    }
  }

  function updateTask(id, title, date) {
    var numId = Number(id)
    var task = tasks.find(function (t) { return t.id === numId })
    if (task) {
      task.title = title
      task.date = date || ''
      saveTasks()
    }
  }

  function moveTask(id, newIndexInVisible) {
    var currentNumber = getFilteredTasks()
    var fromIdx = currentNumber.findIndex(function (t) { return String(t.id) === id })
    if (fromIdx === -1) return
    if (fromIdx === newIndexInVisible) return
    var item = currentNumber.splice(fromIdx, 1)[0]
    currentNumber.splice(newIndexInVisible, 0, item)
    currentNumber.forEach(function (t, i) {
      t.listNumber= i
    })
    saveTasks()
  }

  // собираем страницу и вешаем листенеры
  function buildPage() {
    initStyles()
    initFavicon()

    var main = document.createElement('main')
    main.className = 'todo-app'

    var logo = document.createElement('img')
    logo.src = 'images/full_logo.png'
    logo.alt = 'To-Do List'
    logo.className = 'todo-logo'
    logo.draggable = false
    var form = createForm()
    var controls = createControls()

    var myTasks = document.createElement('div')
    myTasks.className = 'todo-flex-container'
    myTasks.id = 'myTasksContainer'

    var listTittle = document.createElement('p')
    listTittle.textContent = 'Список задач'
    listTittle.className = 'todo-form-tittle'

    var list = document.createElement('ul')
    list.className = 'todo-list'
    list.id = 'todoList'
    myTasks.append(listTittle, list)

    main.append(logo, form, controls, myTasks)
    document.body.appendChild(main)

    loadTasks()
    renderTasks(list)

    function createNewTask (e) {
      e.preventDefault()
      var titleEl = document.getElementById('taskTitle')
      var dateEl = document.getElementById('taskDate')
      var title = titleEl.value.trim()
      //показываем ошибку если нет имени задачи
      if (!title) {
        var errorSpan = document.body.querySelector('#errorSpan'),
            taskTitle = document.body.querySelector('#taskTitle')
        console.log(errorSpan)
        errorSpan.textContent = 'Введите имя вашей задачи в поле для ввода'
        errorSpan.classList.add('visible')
        taskTitle.focus()
        return
      }
      addTask(title, dateEl.value || '')
      titleEl.value = ''
      dateEl.value = ''
      renderTasks(list)
    }

    // подтверждаем форму и добавляем задачу
    form.addEventListener('submit', createNewTask)

    initCustomSelect()

    var searchEl = document.getElementById('searchInput')
    var filterEl = document.getElementById('filterSelect')
    function refreshList() {
      renderTasks(list)
    }
    searchEl.addEventListener('input', refreshList)
    filterEl.addEventListener('change', refreshList)

    // клики по кнопкам в списке
    list.addEventListener('click', function (e) {
      var li = e.target.closest('.todo-item')
      if (!li) return
      var id = li.dataset.id

      if (e.target.classList.contains('btn-delete')) {
        deleteTask(id)
        renderTasks(list)
        return
      }
      if (e.target.classList.contains('btn-done')) {
        toggleDone(id)
        renderTasks(list)
        return
      }
      if (e.target.classList.contains('btn-edit')) {
        var textSpan = li.querySelector('.todo-item-text')
        var dateSpan = li.querySelector('.todo-item-date')
        var newTitle = prompt('Новое название:', textSpan.textContent)
        if (newTitle === null) return
        newTitle = newTitle.trim()
        var newDate = prompt('Новая дата (YYYY-MM-DD):', dateSpan.textContent === '—' ? '' : dateSpan.textContent)
        if (newDate === null) return
        updateTask(id, newTitle, (newDate && newDate.trim()) || '')
        renderTasks(list)
      }
    })

    var draggedId = null
    var mouseDragEl = null
    var mousePlaceholder = null
    var mouseOffsetX = 0
    var mouseOffsetY = 0
    var emptyDragImage = null

    function clearMouseDrag() {
      if (mouseDragEl) {
        mouseDragEl.classList.remove('dragging')
        mouseDragEl.style.position = ''
        mouseDragEl.style.left = ''
        mouseDragEl.style.top = ''
        mouseDragEl.style.width = ''
        mouseDragEl.style.zIndex = ''
      }
      if (mousePlaceholder && mousePlaceholder.parentNode) {
        mousePlaceholder.parentNode.removeChild(mousePlaceholder)
      }
      mousePlaceholder = null
      mouseDragEl = null
    }

    list.addEventListener('dragstart', function (e) {
      var li = e.target.closest('.todo-item')
      if (!li) return
      draggedId = li.dataset.id
      mouseDragEl = li
      li.classList.add('dragging')
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', draggedId)
      //удаляем картинку элемента от drag ивента, чтоб не дублировать ее
      if (!emptyDragImage) {
        emptyDragImage = new Image()
        emptyDragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      }
      e.dataTransfer.setDragImage(emptyDragImage, 0, 0)
      //
      var rect = li.getBoundingClientRect()
      mouseOffsetX = e.clientX - rect.left
      mouseOffsetY = e.clientY - rect.top
      mousePlaceholder = document.createElement('li')
      mousePlaceholder.className = 'todo-drag-placeholder'
      mousePlaceholder.style.height = rect.height + 'px'
      mousePlaceholder.style.marginBottom = '8px'
      list.insertBefore(mousePlaceholder, li)
      li.style.position = 'fixed'
      li.style.width = rect.width + 'px'
      li.style.zIndex = '9999'
      li.style.left = (e.clientX - mouseOffsetX) + 'px'
      li.style.top = (e.clientY - mouseOffsetY) + 'px'
    })
    list.addEventListener('dragend', function (e) {
      clearMouseDrag()
      draggedId = null
    })
    list.addEventListener('dragover', function (e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (mouseDragEl) {
        mouseDragEl.style.left = (e.clientX - mouseOffsetX) + 'px'
        mouseDragEl.style.top = (e.clientY - mouseOffsetY) + 'px'
      }
    })
    list.addEventListener('drop', function (e) {
      e.preventDefault()
      if (!draggedId) return
      var dropLi = null
      var elements = document.elementsFromPoint(e.clientX, e.clientY)
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i]
        if (el.closest && el.closest('.todo-item') === mouseDragEl) continue
        var taskItem = el.closest ? el.closest('.todo-item') : null
        if (taskItem && taskItem.dataset.id !== draggedId) {
          dropLi = taskItem
          break
        }
      }
      if (!dropLi) return
      var all = list.querySelectorAll('.todo-item')
      var idx = Array.prototype.indexOf.call(all, dropLi)
      if (idx === -1) return
      moveTask(draggedId, idx)
      renderTasks(list)
    })

    var touchStartX = 0
    var touchStartY = 0
    var touchDraggedId = null
    var touchDraggedEl = null
    var touchPlaceholder = null
    var touchOffsetX = 0
    var touchOffsetY = 0

    function clearTouchDrag() {
      if (touchDraggedEl) {
        touchDraggedEl.classList.remove('dragging')
        touchDraggedEl.style.position = ''
        touchDraggedEl.style.left = ''
        touchDraggedEl.style.top = ''
        touchDraggedEl.style.width = ''
        touchDraggedEl.style.zIndex = ''
      }
      if (touchPlaceholder && touchPlaceholder.parentNode) {
        touchPlaceholder.parentNode.removeChild(touchPlaceholder)
      }
      touchPlaceholder = null
      document.body.classList.remove('touch-dragging')
      touchDraggedId = null
      touchDraggedEl = null
    }

    list.addEventListener('touchstart', function (e) {
      if (e.target.closest('button') || e.target.closest('.todo-item-actions')) return
      var li = e.target.closest('.todo-item')
      if (!li) return
      touchDraggedId = li.dataset.id
      touchDraggedEl = li
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }, { passive: true })

    list.addEventListener('touchmove', function (e) {
      if (!touchDraggedEl) return
      var t = e.touches[0]
      var y = t.clientY
      var x = t.clientX
      if (!touchPlaceholder && Math.abs(y - touchStartY) > 10) {
        touchDraggedEl.classList.add('dragging')
        document.body.classList.add('touch-dragging')
        var rect = touchDraggedEl.getBoundingClientRect()
        touchOffsetX = touchStartX - rect.left
        touchOffsetY = touchStartY - rect.top
        touchPlaceholder = document.createElement('li')
        touchPlaceholder.className = 'todo-drag-placeholder'
        touchPlaceholder.style.height = rect.height + 'px'
        touchPlaceholder.style.marginBottom = '8px'
        list.insertBefore(touchPlaceholder, touchDraggedEl)
        touchDraggedEl.style.position = 'fixed'
        touchDraggedEl.style.width = rect.width + 'px'
        touchDraggedEl.style.zIndex = '9999'
      }
      if (touchPlaceholder) {
        touchDraggedEl.style.left = (x - touchOffsetX) + 'px'
        touchDraggedEl.style.top = (y - touchOffsetY) + 'px'
        e.preventDefault()
      }
    }, { passive: false })

    list.addEventListener('touchend', function (e) {
      if (!touchDraggedId || !touchDraggedEl) return
      var wasDragging = !!touchPlaceholder
      var idToDrop = touchDraggedId
      clearTouchDrag()
      if (wasDragging && e.changedTouches[0]) {
        var touch = e.changedTouches[0]
        var el = document.elementFromPoint(touch.clientX, touch.clientY)
        var dropLi = el && el.closest ? el.closest('.todo-item') : null
        if (dropLi && dropLi.dataset.id !== idToDrop) {
          var all = list.querySelectorAll('.todo-item')
          var idx = Array.prototype.indexOf.call(all, dropLi)
          if (idx !== -1) {
            moveTask(idToDrop, idx)
            renderTasks(list)
          }
        }
      }
    }, { passive: true })

    list.addEventListener('touchcancel', function () {
      clearTouchDrag()
    }, { passive: true })
  }

  buildPage()
})()
