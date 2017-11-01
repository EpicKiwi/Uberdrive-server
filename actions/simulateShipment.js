'use strict'

exports.action = {
  name: 'simulateShipment',
  description: 'Simule un voyage et en calcule le prix et l\'itinéraire',
  blockedConnectionTypes: [],
  outputExample: {
      "from": {
          "diameter": 4900,
          "gravity": "unknown",
          "name": "Endor",
          "climate": "temperate",
          "terrain": "forests, mountains, lakes",
          "population": 30000000
      },
      "to": {
          "diameter": 10600,
          "gravity": 1,
          "name": "Ryloth",
          "climate": "temperate, arid, subartic",
          "terrain": "mountains, valleys, deserts, tundra",
          "population": 1500000000
      },
      "starship": {
          "hyperdriverate": 0,
          "crewsize": 4,
          "price": 1,
          "length": 34,
          "name": "Millennium Falcon",
          "model": "YT-1300 light freighter",
          "class": "Light freighter",
          "passengersize": 6,
          "speed": 75,
          "capacity": 100000,
          "manufacturer": "Corellian Engineering Corporation"
      },
      "distance": 1413,
      "jounrey": [
          {
              "diameter": 4900,
              "gravity": "unknown",
              "name": "Endor",
              "climate": "temperate",
              "terrain": "forests, mountains, lakes",
              "population": 30000000,
              "type": "planet"
          },
          {
              "type": "bridge",
              "distance": 135
          },
          {
              "diameter": "unknown",
              "gravity": 1,
              "name": "Cerea",
              "climate": "temperate",
              "terrain": "verdant",
              "population": 450000000,
              "type": "planet"
          }]
  },
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
    fromPlanet: {
      required: true
    },
    toPlanet:{
      required: true
    },
    starship: {
      required: true
    }
  },

  run: function (api, data, next) {
      api.shipments.simulate(data.params.fromPlanet,data.params.toPlanet,data.params.starship)
          .then((result)=>{
              data.response.from = result.from
              data.response.to = result.to
              data.response.starship = result.starship
              data.response.distance = result.distance
              data.response.jounrey = result.jounrey
              data.response.totalPrice = result.totalPrice
              return next(null)
          }).catch((error)=>{
          return next(error)
      })
  }
}
