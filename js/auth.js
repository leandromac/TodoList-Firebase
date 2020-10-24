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
        hideItem(loading)
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

// permite que usuário faça a  verficação do email
function sendEmailVerification() {
  showItem(loading)
  let user = firebase.auth().currentUser
  user.sendEmailVerification().then(() => {
    alert('E-mail de verificação foi enviado para ' + user.email + '! verifique a caixa e entrada')
  }).catch(error => {
    alert('Houve um error ao enviar o e-mail de verificação')
    console.log(error)
  }).finally(() => {
    hideItem(loading)
  })
}