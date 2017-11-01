'use strict'

exports.action = {
  name: 'getToken',
  description: 'Renvoie un token d\'authentification à partir des informations de connexion de l\'utilisateur',
  blockedConnectionTypes: [],
  outputExample: {
      "username": "Bob",
      "token": "37f861da0988544fd9bc2bc25af164b23be80710",
      "restrictedIp": "127.0.0.1"
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
    username: {
      required: true
    },
    password: {
      required: true
    }
  },

  run: function (api, data, next) {
    api.users.createToken(data.params.username,data.params.password,data.connection.remoteIP)
    .then((result)=>{
      data.response.username = result.username
      data.response.token = result.token
      data.response.restrictedIp = result.ip
      return next(null)
    }).catch((error)=>{
      return next(error)
    })
  }
}
