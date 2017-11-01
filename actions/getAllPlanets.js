'use strict'

exports.action = {
  name: 'getAllPlanets',
  description: 'Renvoie toutes les planètes connues',
  blockedConnectionTypes: [],
  outputExample: {
      "planets": [
          {
              "diameter": 12500,
              "gravity": 1,
              "name": "Alderaan",
              "climate": "temperate",
              "terrain": "grasslands, mountains",
              "population": 2000000000
          },
          {
              "diameter": 10200,
              "gravity": 1,
              "name": "Yavin IV",
              "climate": "temperate, tropical",
              "terrain": "jungle, rainforests",
              "population": 1000
          }
      ]
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
      api.planets.getAll()
      .then((planets)=>{

        data.response.planets = planets
        return next(null)

      }).catch((error)=>{

        return next(error)

      })
  }
}
