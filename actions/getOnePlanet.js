'use strict'

exports.action = {
  name: 'getOnePlanet',
  description: 'Renvoie les informations sur une planète',
  blockedConnectionTypes: [],
  outputExample: {
      "planet": {
          "diameter": 12500,
          "gravity": 1,
          "name": "Alderaan",
          "climate": "temperate",
          "terrain": "grasslands, mountains",
          "population": 2000000000
      }
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

    inputs: {
        name: {
            required: true
        }
    },

    run: function (api, data, next) {
        api.planets.getOne(data.params.name)
            .then((planet)=>{

                data.response.planet = planet
                return next(null)

            }).catch((error)=>{

            return next(error)

        })
    }
}
