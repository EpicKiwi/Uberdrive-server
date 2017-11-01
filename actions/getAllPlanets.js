'use strict'

exports.action = {
  name: 'getAllPlanets',
  description: 'Renvoie toutes les planètes connues',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
      api.planets.getAll()
          .then((planets)=>{
              data.response = planets
              next(null)
          }).catch((error)=>{
            next(error)
      })
  }
}
