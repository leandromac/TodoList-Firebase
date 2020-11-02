// Trata a submissão do formulário de autenticação
todoForm.onsubmit = event => {
  event.preventDefault() // Evita o redirecionamento da página


  if (todoForm.name.value != '') {
    let file = todoForm.file.files[0] // Seleciona o primeiro aquivo da seleção de aquivos
    if (file != null) { // Verifica se o arquivo foi selecionado
      if (file.type.includes('image')) { // Verifica se o arquivo é uma imagem
        // Compõe o nome do arquivo
        let imgName = firebase.database().ref().push().key + '-' + file.name
        // Compõe o caminho do arquivo
        let imgPath = 'todoListFiles/' + firebase.auth().currentUser.uid + '/' + imgName

        // Cria uma referência de arquivo usando o caminho criado na linha acima
        let storageRef = firebase.storage().ref(imgPath)

        // Inicia o processo de upload
        let upload = storageRef.put(file)

        trackUpload(upload)
      } else {
        alert('O arquivo selecionado precisa ser uma imagem. Tente novamente')
      }
    }

    let data = {
      name: todoForm.name.value,
      nameLowerCase: todoForm.name.value.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).push(data)
      .then(() => {
      console.log('Tarefa "' + data.name + '" adicionada com sucesso')
    }).catch(error => {
      showError('Falha ao adicionar tarefa (use no máximo 30 caracteres): ', error)
    })

    todoForm.name.value = ''
  } else {
    alert('O nome da tarefa não pode ser em branco para criar a tarefa!')
  }
}

// Rastreia o progresso de upload
function trackUpload(upload) {
  showItem(progressFeedback)
  upload.on('state_changed',
    snapshot => { // Segundo argumento: Recebe informações sobre o upload
      console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
      progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
    }, error => { // Terceiro argumento: Função executada em caso de erro no upload
      showError('Falha no upload da imagem', error)

      hideItem(progressFeedback)
    },
    () => { // Quarto argumento: Função executada em caso de sucesso no upload
      console.log('Sucesso no upload')

      hideItem(progressFeedback)
    })

  let playPauseUpload = true // Estado de controle do nosso upload (pausado ou em andamento)
  playPauseBtn.onclick = () => { // Botão para pausar/continuar upload clicado
    playPauseUpload = !playPauseUpload // Inverte o estado de controle do upload
    if (playPauseUpload) { // Se deseja retomar o upload, faça...
      upload.resume() // Retoma o upload
      playPauseBtn.innerHTML = 'Pausar'
      console.log('Upload retomado')
    } else { // Se deseja pausar o upload, faça...
      upload.pause() // Pausa o upload

      playPauseBtn.innerHTML = 'Continuar'
      console.log('Upload pausado')
    }
  }

  cancelBtn.onclick = () => { // Botão para cancelar upload clicado
    upload.cancel() // Cancela o upload

    alert('Upload cancelado pelo usuário')
    hideItem(progressFeedback)
  }
}

// Exibe a lista de tarefas do usuário
function fillTodoList(dataSnapshot) {
  ulTodoList.innerHTML = ''
  let num = dataSnapshot.numChildren()
  todoCount.innerHTML = num + (num > 1 ? ' tarefas' : ' tarefa') + ':' // Exibe na interface o número de tarefas
  dataSnapshot.forEach(item => { // Percorre todos os elementos
    let value = item.val()
    let li = document.createElement('li') // Cria um elemento do tipo li
    li.id = item.key
    let imgLi = document.createElement('img')
    imgLi.src = value.imgUrl ? value.imgUrl : 'img/defaultTodo.png'
    imgLi.setAttribute('class', 'imgTodo')
    li.appendChild(imgLi)
    let spanLi = document.createElement('span') // Cria um elemento do tipo span
    spanLi.appendChild(document.createTextNode(value.name)) // Adiciona o elemento de texto dentro da nossa span
    li.appendChild(spanLi) // Adiciona o span dentro do li

    let liRemoveBtn = document.createElement('button') // Cria um botão para a remoção da tarefa
    liRemoveBtn.appendChild(document.createTextNode('Excluir')) // Define o texto do botão como 'Excluir'
    liRemoveBtn.setAttribute('onclick', 'removeTodo(\"' + item.key + '\")') // Configura o onclick do botão de remoção de tarefas
    liRemoveBtn.setAttribute('class', 'danger todoBtn') // Define classes de estilização para o nosso botão de remoção
    li.appendChild(liRemoveBtn) // Adiciona o botão de remoção no li

    let liUpdateBtn = document.createElement('button') // Cria um botão para a atualização da tarefa
    liUpdateBtn.appendChild(document.createTextNode('Editar')) // Define o texto do botão como 'Editar'
    liUpdateBtn.setAttribute('onclick', 'updateTodo(\"' + item.key + '\")') // Configura o onclick do botão de atualização de tarefas
    liUpdateBtn.setAttribute('class', 'alternative todoBtn') // Define classes de estilização para o nosso botão de atualização
    li.appendChild(liUpdateBtn) // Adiciona o botão de atualização no li

    ulTodoList.appendChild(li) // Adiciona o li dentro da lista de tarefas
  })
}

// Remove tarefas 
function removeTodo(key) {
  let todoName = document.querySelector('#' + key + ' > span')
  let todoImg = document.querySelector('#' + key + ' > img')
  let confimation = confirm('Realmente deseja remover a tarefa \"' + todoName.innerHTML + '\"?')
  if (confimation) {
    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).remove()
      .then(() => {
      console.log('Tarefa "' + todoName.innerHTML + '" removida com sucesso')
      removeFile(todoImg.src)
    }).catch(error => {
      showError('Falha ao remover tarefa: ', error)
    })
  }
}

// Remove arquivos
function removeFile(imgUrl) {
  console.log(imgUrl)
  let result = imgUrl.indexOf('img/defaultTodo.png')
  if(result == -1) {
    firebase.storage().refFromURL(imgURL).delete()
      .then(() => {
        console.log('Arquivo removido com sucesso.')
      }).catch(error => {
        console.log('Falha ao remover arquivo.')
        console.log(error)
      })
  } else {
    console.log('Nenhum arquivo foi removido.')
  }
}

// Atualiza tarefas
function updateTodo(key) {
  let selectedItem = document.getElementById(key)
  let newTodoName = prompt('Escolha um novo nome para a tarefa \"' + selectedItem.innerHTML + '\".', selectedItem.innerHTML)
  if (newTodoName != '') {
    let data = {
      name: newTodoName,
      nameLowerCase: newTodoName.toLowerCase()
    }

    dbRefUsers.child(firebase.auth().currentUser.uid).child(key).update(data)
      .then(() => {
      console.log('Tarefa "' + data.name + '" atualizada com sucesso')
    }).catch(error => {
      showError('Falha ao atualizar tarefa: ', error)
    })
  } else {
    alert('O nome da tarefa não pode ser em branco para atualizar a tarefa')
  }
}