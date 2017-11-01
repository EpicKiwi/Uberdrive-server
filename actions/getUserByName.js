'use strict'

exports.action = {
  name: 'getUserByName',
  description: 'Renvoie un utilisateur a partir de son nom',
  blockedConnectionTypes: [],
  outputExample: {
      "user": {
          "name": "Barbara",
          "location": {
              "diameter": 4900,
              "gravity": "unknown",
              "name": "Endor",
              "climate": "temperate",
              "terrain": "forests, mountains, lakes",
              "population": 30000000
          }
      }
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
    username:{
      required: true
    }
  },

  run: function (api, data, next) {
    api.users.getByName(data.params.username)
    .then((user)=>{
      data.response.user = user
      return next(null)
    }).catch(error => {
      return next(error)
    })
  }
}
