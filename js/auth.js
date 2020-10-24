// função que trata a submissão do formulário de autenticação
authForm.onsubmit = event => {
  showItem(loading)
  event.preventDefault()
  if(authForm.submitAuthForm.innerHTML == 'Acessar') {
    firebase.auth()
      .signInWithEmailAndPassword(
        authForm.email.value,
        authForm.password.value
      ).catch( error => {
        console.log('Falha no acesso')
        console.log(error)
      })
  } else {
    firebase.auth()
      .createUserWithEmailAndPassword(
        authForm.email.value,
        authForm.password.value
      ).catch( error => {
        console.log('Falha no cadastro')
        console.log(error)
      })
  }
}

// função que centraliza e trata a autenticação
firebase.auth().onAuthStateChanged( user => {
  hideItem(loading)
  if(user) {
    showUserContent(user)
  } else {
    showAuth()
  }
})

// função de logout da conta de usuário
function signOut() {
  firebase.auth().signOut().catch( error => {
    console.log('Falha ao sair da conta')
    console.log(error)
  })
}