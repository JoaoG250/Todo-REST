$('#newTodoBtn').on('click', createTodo)
$('.tab-link').click(function (event) {
    event.preventDefault()
    makeTabActive($(this))
})

function makeTabActive(element) {
    window.history.pushState('', '', element.attr('href'))
    $('.nav-tabs').find('.nav-link.active').removeAttr('aria-current').removeClass('active')
    element.attr('aria-current', 'page').addClass('active')
    listTodos()
}

function listTodos() {
    let todoList = $('#todoList')
    let selectedTab = false
    if ($('#tabDone').attr('aria-current')) {
        selectedTab = true
    }
    todoList.empty()
    let todos = window.todos.filter(obj => obj.concluido === selectedTab)
    $.each(todos, function (index, obj) {
        todoList.append(createTodoElement(obj))
    })
}

function getTodos() {
    let todoList = $('#todoList')
    $.ajax({
        method: 'GET',
        url: todoList.data('url'),
        success: function (data, textStatus, jqXHR) {
            window['todos'] = data
            listTodos()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        }
    })
}

function createTodo() {
    let url = $('#todoList').data('url')
    let form = $('#todoModalForm')
    form.trigger('reset')
    form.attr('action', url)
    form.attr('method', 'POST')
    form.find('button[type="submit"]').html('Criar')
    $('#todoModalLabel').html('Criar Todo')
}

function editTodo() {
    let todo = $(this).data('todo')
    let form = $('#todoModalForm')
    form.attr('action', todo.url)
    form.attr('method', 'PATCH')
    form.find('button[type="submit"]').html('Salvar')
    $('#todoModalLabel').html('Editar Todo')
    $('#id_titulo').val(todo.titulo)
    $('#id_descricao').val(todo.descricao)
    if (todo.concluido) {
        $('#id_concluido').prop('checked', true)
    } else {
        $('#id_concluido').prop('checked', false)
    }
}

function deleteTodo() {
    let id = $(this).data('id')
    let url = $(this).data('url')
    $.ajax({
        method: 'DELETE',
        url: url,
        success: function (data, textStatus, jqXHR) {
            $(`#todo-${id}`).remove()
            window.todos = window.todos.filter(obj => obj.id !== id)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR)
        }
    })
}

function createTodoElement(obj) {
    let todo = $(
        `<li id="todo-${obj.id}" class="list-group-item d-flex justify-content-between align-items-center">
        <span title="${obj.descricao}">${obj.titulo}</span>
        </li>`
    )
    let span = $(`<span></span>`)
    let editButton = $(
        `<button class="btn btn-secondary me-2" data-bs-toggle="modal" data-bs-target="#todoModal">
        Editar
        </button>`
    )
    editButton.data('todo', obj)
    editButton.on('click', editTodo)
    let deleteButton = $(
        `<button class="btn btn-danger">
        Excluir
        </button>`
    )
    deleteButton.data({ 'id': obj.id, 'url': obj.url })
    deleteButton.on('click', deleteTodo)
    span.append(editButton)
    span.append(deleteButton)
    todo.append(span)
    return todo
}

function initForm(form_id) {
    $form = $(form_id)

    $form.submit(function (event) {
        event.preventDefault()
        let method = $(this).attr('method')
        let url = $(this).attr('action')
        let formData = $(this).serializeArray()
        $.each($form.find('input[type="checkbox"]:not(:checked)'), function (index, obj) {
            formData.push({ name: obj.name, value: obj.checked ? obj.value : "false" })
        })
        $.ajax({
            method: method,
            url: url,
            data: formData,
            success: function (data, textStatus, jqXHR) {
                if (method === 'POST') {
                    window.todos.push(data)
                } else if (method === 'PATCH') {
                    let obj_index = window.todos.findIndex(obj => obj.id === data.id)
                    window.todos[obj_index] = data
                }
                $form.trigger('reset')
                listTodos()
                $('.modal').modal('hide')
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        })
    })
}

$(document).ready(getTodos(), initForm('#todoModalForm'))