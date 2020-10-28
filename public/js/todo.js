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
    li.appendChild(span)
    ulTodoList.appendChild(li)
  })
}