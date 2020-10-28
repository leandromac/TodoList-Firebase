// trata submissão do formulário de autenticação
todoForm.onsubmit = function(event) {
  event.preventDefault()
  if(todoForm.name.value != '') {
    var data = {
      name: todoForm.name.value
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
      .then(() => {
        console.log( data.name + ' adicionada com sucesso.')
      }).catch(error => {
        showError('Falha ao adicionar tarefa', error)
      })
  } else {
    alert('Nome da tarefa não pode estar vazio.')
  }
}

// Exibe a lista de tarefas de usuários
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = ''
  let num = dataSnapshot.numChildren()
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':'
  dataSnapshot.forEach(item => {
    let value = item.val()
    let li = document.createElement('li')
    let span = document.createElement('span')
    span.appendChild(document.createTextNode(value.name))
    span.id = item.key
    li.appendChild(span)
    let btnRemove = document.createElement('button')
    btnRemove.appendChild(document.createTextNode('Apagar'))
    btnRemove.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")')
    btnRemove.setAttribute('class', 'danger todoBtn')
    li.appendChild(btnRemove)
    ulTodoList.appendChild(li)
  })
}

// Remove todo
function removeTodo(key) {
  let getTextTodo = document.getElementById(key)
  let confirmation = confirm('Tem certeza que deseja remover essa tarefa \"' + getTextTodo.innerHTML + '\"?')
  if(confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
      .catch(error => {
        showError('Falha ao remover tarefa: ', error)
      })
  }
}