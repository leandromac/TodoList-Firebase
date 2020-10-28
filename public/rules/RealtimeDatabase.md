# Padrão
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

# Público
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# Usuários autenticados
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

# Acesso restrito do conteúdo ao usuário que criou
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid == auth.uid",
        ".write": "$uid == auth.uid",
      }
    }
  }
}

# Incluindo regra de validação
# Faz com que só o campo seja string e tenha no máximo 30 caracteres
"$tid": {
  ".validate": newData.child('name').isString() && newData.child('name').val().length <= 30"
}