'use strict'

exports.action = {
  name: 'createShipment',
  description: 'an actionhero action',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {
      username: {
        required: true
      },
      fromPlanet: {
          required: true
      },
      toPlanet: {
          required: true
      },
      starship: {
          required: true
      },
  },

  run: function (api, data, next) {
      api.shipments.create(data.params.username,data.params.fromPlanet,data.params.toPlanet,data.params.starship)
          .then((result)=>{
              data.response.user = result.user
              data.response.from = result.from
              data.response.to = result.to
              data.response.starship = result.starship
              data.response.distance = result.distance
              data.response.jounrey = result.jounrey
              data.response.totalPrice = result.totalPrice
              data.response.shipmentId = result.shipmentId
              api.users.setLocation(result.user.name,result.to.name)
              .then(()=>{
                  return next(null)
              }).catch(()=>{
                  return next(null)
              })
          }).catch((error)=>{
          return next(error)
      })
  }
}
