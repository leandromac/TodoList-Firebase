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
      })
  } else {
    alert('Nome da tarefa não pode estar vazio.')
  }
}