'use strict'

exports.action = {
  name: 'getOneShipment',
  description: 'Renvoie toutes les informations d\'un voyage',
  blockedConnectionTypes: [],
  outputExample: {
      "user": "Barbara",
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
    id:{
      required: true
    }
  },

  run: function (api, data, next) {
      api.shipments.getOne(data.params.id)
          .then((result)=>{
              data.response.user = result.user
              data.response.from = result.from
              data.response.to = result.to
              data.response.starship = result.starship
              data.response.distance = result.distance
              data.response.jounrey = result.jounrey
              data.response.totalPrice = result.totalPrice
              data.response.shipmentId = result.shipmentId
              return next(null)
          }).catch((error)=>{
          return next(error)
      })
  }
}
