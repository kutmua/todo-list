(function () {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn','btn-primary');
    button.textContent='Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList () {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done = false) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item','d-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    item.name = name;
    item.done = done;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn','btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn','btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // проверка сделана ли задача
    if (done) {
      item.classList.toggle('list-group-item-success')
    }

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(container, title = "Список дел", tasksList = []){
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    let localItems = JSON.parse(localStorage.getItem(title));

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    // -----------------
    //  localStorage
    if (localItems === null) {
      localItems = [];
    }

    if (localItems.length > 0) {
      for (let count of localItems) {
        let todoItem = createTodoItem(count.name, count.done);
        todoItem.doneButton.addEventListener('click', function(){
          todoItem.item.classList.toggle('list-group-item-success');
          localItems.find(x => x.name == todoItem.item.name).done = todoItem.item.classList.contains('list-group-item-success');
          localStorage.setItem(title, JSON.stringify(localItems));
        });

        todoItem.deleteButton.addEventListener('click', function(){
          if (confirm('Вы уверены')) {
            localItems.splice(localItems.indexOf(x => x.name == todoItem.item.name), 1);
            todoItem.item.remove();
            localStorage.setItem(title, JSON.stringify(localItems));
          }
        });

        todoList.append(todoItem.item);
      }
    }
    // -----------------

    //-------------------------------------
    // Список дел по умолчанию
    for (let i=0; i<tasksList.length; i++) {
      let defaultTask = tasksList[i].name.toString();
      let todoItem = createTodoItem(defaultTask);
      todoList.append(todoItem.item)

      // добавляем обработчик на кнопки
      todoItem.doneButton.addEventListener('click', function(){
        todoItem.item.classList.toggle('list-group-item-success');
      });
      todoItem.deleteButton.addEventListener('click', function(){
        if (confirm('Вы уверены')) {
          todoItem.item.remove();
        }
      });

      if (tasksList[i].done) {
        todoItem.item.classList.toggle('list-group-item-success');
      }
    }
    // --------------------------------------

    // браузер создаёт  событие на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function(e) {
      // эта строчка нужна, чтобы при отправке формы страница не перезагружалась
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);
      localItems.push({ name: todoItemForm.input.value, done: false });
      localStorage.setItem(title, JSON.stringify(localItems));

      // добавляем обработчик на кнопки
      todoItem.doneButton.addEventListener('click', function(){
        todoItem.item.classList.toggle('list-group-item-success');
        localItems.find(x => x.name == todoItem.item.name).done = todoItem.item.classList.contains('list-group-item-success');
        localStorage.setItem(title, JSON.stringify(localItems));
      });

      todoItem.deleteButton.addEventListener('click', function(){
        if (confirm('Вы уверены')) {
          localItems.splice(localItems.indexOf(x => x.name == todoItem.item.name), 1);
          todoItem.item.remove();
          localStorage.setItem(title, JSON.stringify(localItems));
        }
      });

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;

  // проверка input на наличие текста
  function inputCheck() {
    if (!input.value) {
      button.setAttribute('disabled','disabled')
    }
    else {
      button.removeAttribute('disabled')
    }
  }
  setInterval(() => {
    inputCheck()
  }, 100);

})();

