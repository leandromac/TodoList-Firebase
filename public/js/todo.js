// trata submissão do formulário de autenticação
todoForm.onsubmit = function(event) {
  event.preventDefault()
  if(todoForm.name.value != '') {
    let file = todoForm.file.files[0]
    if(file != null) {
      if(file.type.includes('image')) {
        let imgName = firebase.database().ref().push().key + '-' + file.name
        let imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName
        let storageRef = firebase.storage().ref(imgPath)
        let upload = storageRef.put(file)
        trackUpload(upload)
      } else {
        alert('O arquivo selecionado precisa ser selecionado.')
      }
      
    }
    
    let data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
      .then(() => {
        console.log( data.name + ' adicionada com sucesso.')
      }).catch(error => {
        showError('Falha ao adicionar tarefa (máximo 30 caracteres)', error)
      })
      todoForm.name.value = ''
  } else {
    alert('Nome da tarefa não pode estar vazio.')
  }
}

// Rastreia o progresso de upload
function trackUpload(upload) {
  showItem(progressFeedback)
  upload.on('state_changed', snapshot => {
    progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100 + '%'
    console.log(snapshot)
    console.log(snapshot.bytesTransferred / snapshot.totalBytes * 100 + '%')
  }, error => {
    showError(error, 'Falha no upload da imagem')
  }, () => {
    console.log('Sucesso no upload')
  })
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
    let btnUpdate = document.createElement('button')
    btnUpdate.appendChild(document.createTextNode('Editar'))
    btnUpdate.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")')
    btnUpdate.setAttribute('class', 'alternative todoBtn')
    li.appendChild(btnUpdate)
    ulTodoList.appendChild(li)
  })
}

// Remove todo
function removeTodo(key) {
  let selectedItem = document.getElementById(key)
  let confirmation = confirm('Tem certeza que deseja remover essa tarefa \"' + selectedItem.innerHTML + '\"?')
  if(confirmation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
      .then(() => {
        console.log('Tarefa \"' + data.name + '\" removida com sucesso')
      }).catch(error => {
        showError('Falha ao remover tarefa: ', error)
      })
  }
}

// Atualizar todo
function updateTodo(key) {
  let selectedItem = document.getElementById(key)
  let newTodoName = prompt('Escolha um nome para a tarefa \"' + selectedItem.innerHTML + '\".', selectedItem.innerHTML)
  if(newTodoName != '') {
    let data = {
      name: newTodoName,
      nameLowerCase: newTodoName.toLowerCase()
    }
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data)
      .then(() => {
        console.log('Tarefa \"' + data.name + '\" atualizada com sucesso')
      }).catch(error => {
        showError('Falha ao atualizar tarefa: ', error)
      })
  } else {
    alert('O nome da tarefa não pode estar em branco!')
  }
}