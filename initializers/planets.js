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

    api.planets.getConnected = async function getConnectedPlanets(initialPlanetName){
        let session = api.graphdb.getSession()
        let rawPlanets = await session.run(`MATCH (n:Planet {name: "${initialPlanetName}"})-[r:Bridge*]-(p:Planet) 
                                            UNWIND r as br 
                                            RETURN p,sum(br.distance) as distance 
                                            ORDER BY distance`)
        session.close()

        return api.graphdb.mapRecords(rawPlanets,(planet,rawRecord)=>{
            planet.distance = rawRecord["_fields"][1].low
        })
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
