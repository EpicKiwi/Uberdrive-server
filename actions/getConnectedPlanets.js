'use strict'

exports.action = {
  name: 'getConnectedPlanets',
  description: 'Renvoie toutes les planètes connectées à une planète spécifée ainsi que la distance qui les séparent',
  blockedConnectionTypes: [],
  outputExample: {
      "planets": [
          {
              "diameter": 14050,
              "gravity": 1,
              "name": "Ord Mantell",
              "climate": "temperate",
              "terrain": "plains, seas, mesas",
              "population": -294967296,
              "distance": 19
          },
          {
              "diameter": 12120,
              "gravity": 1,
              "name": "Naboo",
              "climate": "temperate",
              "terrain": "grassy hills, swamps, forests, mountains",
              "population": 205032704,
              "distance": 76
          }
      ]
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
      initalPlanet: { required: true }
  },

  run: function (api, data, next) {
      api.planets.getConnected(data.params.initalPlanet)
      .then((planets)=>{

        data.response.planets = planets
        return next(null)

      }).catch((error)=>{

        return next(error)

      })
  }
}