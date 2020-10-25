// Traduz os emails enviados pelo firebase para português
firebase.auth().languageCode = 'pt-br'

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
        hideItem(loading)
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
  user.sendEmailVerification(actionCodeSettings).then(() => {
    alert('E-mail de verificação foi enviado para ' + user.email + '! verifique a caixa e entrada')
  }).catch(error => {
    alert('Houve um error ao enviar o e-mail de verificação')
    console.log(error)
  }).finally(() => {
    hideItem(loading)
  })
}

// permite o usuário redefinir senha
function sendPasswordResetEmail() {
  let email = prompt('Redefinir senha! Informe o seu endereço de email.', authForm.email.value)
  if(email) {
    showItem(loading)
    firebase.auth().sendPasswordResetEmail(email, actionCodeSettings)
      .then(() => {
        alert('E-mail de redefinição de senha foi enviado para ' + email + '.')
      }).catch( error => {
        alert('Houve um erro ao enviar e-mail de redefinição de senha!')
        console.log(error)
      }).finally(() => {
        hideItem(loading)
      })
  } else {
    alert('É preciso preencher o campo de email para redefinir a senha!')
  }
}

// permite autenticação com o google
function signInWithGoogle() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch( error => {
      alert('Houve um erro ao autenticar com o Google!')
      console.log(error)
      hideItem(loading)
    })
}