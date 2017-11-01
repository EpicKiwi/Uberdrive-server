'use strict'

exports.action = {
  name: 'getAllStarships',
  description: 'Renvoie tout les vaisseaux disponibles',
  blockedConnectionTypes: [],
  outputExample: {
      "starships": [{
          "hyperdriverate": 1,
          "crewsize": 5,
          "price": 2.4,
          "length": 38,
          "name": "Sentinel-class landing craft",
          "model": "Sentinel-class landing craft",
          "class": "landing craft",
          "speed": 70,
          "passengersize": 75,
          "capacity": 180000,
          "manufacturer": "Sienar Fleet Systems, Cyngus Spaceworks"
      }]
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
      api.starships.getAll()
          .then((starships)=>{

              data.response.starships = starships
              return next(null)

          }).catch((error)=>{

          return next(error)

      })
  }
}
