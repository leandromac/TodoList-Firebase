// Defindo referências para elementos da página
const authForm = document.getElementById('authForm')
const authFormTitle = document.getElementById('authFormTitle')
const register = document.getElementById('register')
const access = document.getElementById('access')
const loading = document.getElementById('loading')
const auth = document.getElementById('auth')
const userContent = document.getElementById('userContent')
const userEmail = document.getElementById('userEmail')
const sendEmailVerificationDiv = document.getElementById('sendEmailVerificationDiv')
const emailVerified = document.getElementById('emailVerified')
const passwordReset = document.getElementById('passwordReset')
const userName = document.getElementById('userName')
const userImg = document.getElementById('userImg')

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register)
  hideItem(passwordReset)
  showItem(access)
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access)
  showItem(passwordReset)
  showItem(register)
}

// Simplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = 'block'
}

// Simpplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = 'none'
}

// mostrar contedúdo para usuário autenticado
function showUserContent(user) {
  console.log(user)
  if(user.providerData[0].providerId != 'password') {
    emailVerified.innerHTML = 'Verificação feita por provedor confiável!'
    showItem(sendEmailVerificationDiv)
  } else {
    if(user.emailVerified) {
      emailVerified.innerHTML = 'E-mail verificado'
      hideItem(sendEmailVerificationDiv)
    } else {
      emailVerified.innerHTML = 'E-mail não verificado'
      showItem(sendEmailVerificationDiv)
    }
  }
  
  userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
  userName.innerHTML = user.displayName
  userEmail.innerHTML = user.email
  hideItem(auth)
  showItem(userContent)
}

// mostrar contedúdo para usuário NÃO autenticado
function showAuth() {
  authForm.email.value = ''
  authForm.password.value = ''
  hideItem(userContent)
  showItem(auth)
}

// centralizar e traduzir erros
function showError(prefix, error) {
  console.log(error.code)
  hideItem(loading)
  switch (error.code) {
    case 'auth/invalid-email':
      alert(prefix + ' ' + 'E-mail inválido!')
    break;
    case 'auth/wrong-password':
      alert(prefix + ' ' + 'Senha inválida!')
    break;
    case 'auth/user-not-found':
      alert(prefix + ' ' + 'Usuário não encontrado!')
    break;
    case 'auth/weak-password':
      alert(prefix + ' ' + 'Senha precisa ter mais de 6 dígitos!')
    break;
    case 'auth/email-already-in-use':
      alert(prefix + ' ' + 'Este email já está cadastrado!')
    break;
    case 'auth/popup-closed-by-user':
      alert(prefix + ' ' + 'O popup de autenticação foi fechado antes da conclusão da operação!')
    break;
    default: alert(prefix + ' ' + error.message)
  }
}

// atribulots extras de configuração de email
const actionCodeSettings = {
  url: 'http://127.0.0.1:5500/'
}