'use strict'

module.exports = {
  loadPriority: 1010,
  startPriority: 1010,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.planets = {}

    api.planets.getAll = async function getAllPlanets(){
        let session = api.graphdb.getSession()
        let rawPlanets = await session.run("MATCH (p:Planet) RETURN p")
        session.close()
        return api.graphdb.mapRecords(rawPlanets)
    }

    return next()
  },
  start: function (api, next) {
    return next()
  },
  stop: function (api, next) {
    return next()
  }
}
