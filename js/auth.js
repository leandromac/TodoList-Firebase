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
        showError('Falha no acesso: ', error)
      })
  } else {
    firebase.auth()
      .createUserWithEmailAndPassword(
        authForm.email.value,
        authForm.password.value
      ).catch( error => {
        showError('Falha no cadastro: ', error)
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
    showError('Falha ao sair da conta: ', error)
  })
}

// permite que usuário faça a  verficação do email
function sendEmailVerification() {
  showItem(loading)
  let user = firebase.auth().currentUser
  user.sendEmailVerification(actionCodeSettings).then(() => {
    alert('E-mail de verificação foi enviado para ' + user.email + '! verifique a caixa e entrada')
  }).catch(error => {
    showError('Falha na verificação de email: ', error)
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
        showError('Falha ao refefinir senha: ', error)
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
      showError('Falha na autenticação com o Google: ', error)
    })
}

// permite autenticação com o github
function signInWithGithub() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
    .catch( error => {
      showError('Falha na autenticação com o Github: ', error)
    })
}

// permite autenticação com o facebook
function signInWithFacebook() {
  showItem(loading)
  firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
    .catch( error => {
      showError('Falha na autenticação com o Facebook: ', error)
    })
}

// permite atualizar nome de usuário
function updateUserName() {
  let newUserName = prompt('Informe um novo nome de usuário.', userName.innerHTML)
  if(newUserName && newUserName != '') {
    userName.innerHTML = newUserName
    showItem(loading)
    firebase.auth().currentUser.updateProfile({
      displayName: newUserName
    }).catch(error => {
      showError('Erro ao atualizar nome de usuário: ', error)
    }).finally(() => {
      hideItem(loading)
    })
  } else {
    alert('Nome de usuário não pode estar vazio.')
  }
}

// remove a conta de usuário
function deleteAccount() {
  let confirmation = confirm('Tem certeza que deseja excluir a sua conta?')
  if(confirmation) {
    showItem(loading)
    firebase.auth().currentUser.delete()
      .then(() => {
        alert('Conta excluída com sucesso!')
      }).catch(error => {
        showError('Falha ao remover esta conta: ', error)
      }).finally(() => {
        hideItem(loading)
      })
  }
}