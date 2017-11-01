'use strict'

module.exports = {
  loadPriority: 1010,
  startPriority: 1010,
  stopPriority: 1010,
  initialize: function (api, next) {
    api.starships = {}

    api.starships.getAll = async function getAllStarships(){
        let session = api.graphdb.getSession()
        let rawShips = await session.run("MATCH (p:Ship) RETURN p")
        session.close()
        return api.graphdb.mapRecords(rawShips)
    }

      api.starships.getOne = async function getAllStarships(starshipName){
          let session = api.graphdb.getSession()
          let rawShips = await session.run("MATCH (p:Ship) WHERE p.name = \""+starshipName+"\" RETURN p")
          session.close()
          return api.graphdb.mapRecords(rawShips)[0]
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
