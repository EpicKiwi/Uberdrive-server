'use strict'

exports.action = {
  name: 'getOneStarship',
  description: 'Renvoie les informations sur un vaisseau',
  blockedConnectionTypes: [],
  outputExample: {
      "starship": {
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
      api.starships.getOne(data.params.name)
          .then((starship)=>{

              data.response.starship = starship
              return next(null)

          }).catch((error)=>{

          return next(error)

      })
  }
}
