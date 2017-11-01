'use strict'

exports.action = {
  name: 'registerUser',
  description: 'Enregistre un utilisateur sur le site',
  blockedConnectionTypes: [],
  outputExample: {
      "username": "Bob"
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],
  authentication: false,

  inputs: {
      username: {
          required: true
      },
      password: {
          required: true
      }
  },

  run: function (api, data, next) {
      api.users.register(data.params.username,data.params.password)
          .then((result)=>{
              data.response.username = result.username
              return next(null)
          }).catch((error)=>{
          return next(error)
      })
  }
}
