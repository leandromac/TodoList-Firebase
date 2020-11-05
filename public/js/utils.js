// Definindo referências para elementos da página
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
const todoForm = document.getElementById('todoForm')
const todoCount = document.getElementById('todoCount')
const ulTodoList = document.getElementById('ulTodoList')
const search = document.getElementById('search')
const progressFeedback = document.getElementById('progressFeedback')
const progress = document.getElementById('progress')
const playPauseBtn = document.getElementById('playPauseBtn')
const cancelBtn = document.getElementById('cancelBtn')
const cancelUpdateTodo = document.getElementById('cancelUpdateTodo')
const todoFormTitle = document.getElementById('todoFormTitle')

// Alterar o formulário de autenticação para o cadastro de novas contas
function toggleToRegister() {
  authForm.submitAuthForm.innerHTML = 'Cadastrar conta'
  authFormTitle.innerHTML = 'Insira seus dados para se cadastrar'
  hideItem(register) // Esconder atalho para cadastrar conta
  hideItem(passwordReset) // Esconder a opção de redefinição de senha
  showItem(access) // Mostrar atalho para acessar conta
}

// Alterar o formulário de autenticação para o acesso de contas já existentes
function toggleToAccess() {
  authForm.submitAuthForm.innerHTML = 'Acessar'
  authFormTitle.innerHTML = 'Acesse a sua conta para continuar'
  hideItem(access) // Esconder atalho para acessar conta
  showItem(passwordReset) // Mostrar a opção de redefinição de senha
  showItem(register) // Mostrar atalho para cadastrar conta
}

// Simplifica a exibição de elementos da página
function showItem(element) {
  element.style.display = 'block'
}

// Simplifica a remoção de elementos da página
function hideItem(element) {
  element.style.display = 'none'
}

// Mostrar conteúdo para usuários autenticados
function showUserContent(user) {
  console.log(user)
  if (user.providerData[0].providerId != 'password') {
    emailVerified.innerHTML = 'Autenticação por provedor confiável, não é necessário verificar e-mail'
    hideItem(sendEmailVerificationDiv)
  } else {
    if (user.emailVerified) {
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

  getDefaultTodoList()
  search.onkeyup = () => {
    if (search.value != '') {
      let searchText = search.value.toLowerCase()
      dbRefUsers.child(user.uid)
      .orderByChild('nameLowerCase') // Ordena as tarefas pelo nome da tarefa
      .startAt(searchText).endAt(searchText + '\uf8ff') // Delimita os resultados de pesquisa
      .once('value').then(dataSnapshot => { // Busca tarefas filtradas somente uma vez (once)
        fillTodoList(dataSnapshot)
      })
    } else {
      getDefaultTodoList()
    }
  }

  showItem(userContent)
}

// Busca tarefas em tempo real (listagem padrão usando o on)
function getDefaultTodoList() {
  dbRefUsers.child(firebase.auth().currentUser.uid)
  .orderByChild('nameLowerCase') // Ordena as tarefas pelo nome da tarefa
  .on('value', dataSnapshot => {
    fillTodoList(dataSnapshot)
  })
}

// Mostrar conteúdo para usuários não autenticados
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
    case 'auth/invalid-email': alert(prefix + ' ' + 'E-mail inválido!')
    break;
    case 'auth/wrong-password': alert(prefix + ' ' + 'Senha inválida!')
    break;
    case 'auth/weak-password': alert(prefix + ' ' + 'Senha deve ter ao menos 6 caracteres!')
    break;
    case 'auth/email-already-in-use': alert(prefix + ' ' + 'E-mail já está em uso por outra conta!')
    break;
    case 'auth/popup-closed-by-user': alert(prefix + ' ' + 'O popup de autenticação foi fechado antes da operação ser concluída!')
    break;   
    case 'storage/canceled': 
    break;
    case 'storage/unauthorized': alert(prefix + ' ' + 'Falha ao acessar o Cloud Storage!') 
    break;
  
    default: alert(prefix + ' ' + error.message)
  }
}

// Atributos extras de configuração de e-mail
let actionCodeSettings = {
  url: 'https://todolist-84473.firebaseapp.com'
}

let database = firebase.database()
let dbRefUsers = database.ref('users')