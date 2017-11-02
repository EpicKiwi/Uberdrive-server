'use strict'

module.exports = {
  loadPriority: 1010,
  startPriority: 1010,
  stopPriority: 1010,
  initialize: function (api, next) {
    api.shipments = {}

      api.shipments.mapShipmentRecord = function mapShipmentRecord(el) {
          let record = {}
          record.user = api.graphdb.mapNode(el["_fields"][0]).name
          record.from = api.graphdb.mapNode(el["_fields"][1])
          record.to = api.graphdb.mapNode(el["_fields"][2])
          record.starship = api.graphdb.mapNode(el["_fields"][3])
          record.distance = el["_fields"][4].low
          record.jounrey = []
          el["_fields"][5].segments.forEach((el,index,array)=>{
              let start = api.graphdb.mapNode(el.start)
              start.type = "planet"
              record.jounrey.push(start)
              let bridge = {type:"bridge",distance:el.relationship.properties.distance.low}
              record.jounrey.push(bridge)
              if(index == array.length-1){
                  let end = api.graphdb.mapNode(el.start)
                  end.type = "planet"
                  record.jounrey.push(end)
              }
          })
          record.totalPrice = record.distance*record.starship.price
          record.shipmentId = el["_fields"][6].low
          return record
      }

    api.shipments.getAllByUser = async function getAllShipmentsByUser(username){

        let session = api.graphdb.getSession()
        let rawShipments = await session.run(`MATCH   (shipment:Shipment), 
                                                      (shipment)-[:AskFor]-(user:User), 
                                                      (shipment)-[:From]-(fromPlanet:Planet), 
                                                      (shipment)-[:To]-(toPlanet:Planet), 
                                                      (shipment)-[:With]-(spaceship:Ship),
                                                      journey=shortestPath((fromPlanet)-[path:Bridge*]-(toPlanet))
                                               WHERE user.name =~ "(?ui)${username}"
                                               UNWIND path as pathr 
                                               RETURN user, 
                                                      fromPlanet, 
                                                      toPlanet, 
                                                      spaceship, 
                                                      sum(pathr.distance) as distance,
                                                      journey,
                                                      id(shipment)`)
        session.close()
        return rawShipments.records.map(api.shipments.mapShipmentRecord)
    }

      api.shipments.getOne = async function getOneShipment(shipmentId){
          let session = api.graphdb.getSession()
          let rawShipments = await session.run(`MATCH (shipment:Shipment), 
                                                      (shipment)-[:AskFor]-(user:User), 
                                                      (shipment)-[:From]-(fromPlanet:Planet), 
                                                      (shipment)-[:To]-(toPlanet:Planet), 
                                                      (shipment)-[:With]-(spaceship:Ship),
                                                      journey=shortestPath((fromPlanet)-[path:Bridge*]-(toPlanet))
                                               WHERE id(shipment) = ${shipmentId}
                                               UNWIND path as pathr 
                                               RETURN user, 
                                                      fromPlanet, 
                                                      toPlanet, 
                                                      spaceship, 
                                                      sum(pathr.distance) as distance,
                                                      journey,
                                                      id(shipment)`)
          session.close()
          return api.shipments.mapShipmentRecord(rawShipments.records[0])
      }

      api.shipments.simulate = async function simulateShipment(fromplanetName,toPlanetName,spaceshipName){
          let session = api.graphdb.getSession()
          let rawShipments = await session.run(`MATCH (fromPlanet:Planet), 
                                                      (toPlanet:Planet), 
                                                      (spaceship:Ship),
                                                      journey=shortestPath((fromPlanet)-[path:Bridge*]-(toPlanet))
                                               WHERE fromPlanet.name = "${fromplanetName}" AND toPlanet.name = "${toPlanetName}" AND spaceship.name = "${spaceshipName}"
                                               UNWIND path as pathr 
                                               RETURN fromPlanet, 
                                                      toPlanet, 
                                                      spaceship, 
                                                      sum(pathr.distance) as distance,
                                                      journey`)
          session.close()
          if(rawShipments.records.length < 1)
              throw new Error("Unable to find a correct path to simulate this shipment")
          let el = rawShipments.records[0]
          let record = {}
          record.from = api.graphdb.mapNode(el["_fields"][0])
          record.to = api.graphdb.mapNode(el["_fields"][1])
          record.starship = api.graphdb.mapNode(el["_fields"][2])
          record.distance = el["_fields"][3].low
          record.jounrey = []
          el["_fields"][4].segments.forEach((el,index,array)=>{
              let start = api.graphdb.mapNode(el.start)
              start.type = "planet"
              record.jounrey.push(start)
              let bridge = {type:"bridge",distance:el.relationship.properties.distance.low}
              record.jounrey.push(bridge)
              if(index == array.length-1){
                  let end = api.graphdb.mapNode(el.start)
                  end.type = "planet"
                  record.jounrey.push(end)
              }
          })
          record.totalPrice = record.distance*record.starship.price
          return record
      }

      api.shipments.create = async function createShipment(username,fromplanetName,toPlanetName,spaceshipName){
          let session = api.graphdb.getSession()
          let rawShipments = await session.run(`MATCH (user:User),
                                                      (fromPlanet:Planet {name:"${fromplanetName}"}), 
                                                      (toPlanet:Planet {name:"${toPlanetName}"}), 
                                                      (spaceship:Ship {name:"${spaceshipName}"}),
                                                      journey=shortestPath((fromPlanet)-[path:Bridge*]-(toPlanet))
                                               WHERE user.name =~ "(?ui)${username}"
                                               CREATE  (shipment:Shipment),
                                                       (shipment)<-[:AskFor]-(user),
                                                       (shipment)-[:From]->(fromPlanet),
                                                       (shipment)-[:To]->(toPlanet),
                                                       (shipment)-[:With]->(spaceship)
                                               RETURN id(shipment)`)
          rawShipments = await session.run(`MATCH     (shipment:Shipment), 
                                                      (shipment)-[:AskFor]-(user:User), 
                                                      (shipment)-[:From]-(fromPlanet:Planet), 
                                                      (shipment)-[:To]-(toPlanet:Planet), 
                                                      (shipment)-[:With]-(spaceship:Ship),
                                                      journey=shortestPath((fromPlanet)-[path:Bridge*]-(toPlanet))
                                               WHERE id(shipment) = ${rawShipments.records[0]["_fields"][0].low}
                                               UNWIND path as pathr 
                                               RETURN user, 
                                                      fromPlanet, 
                                                      toPlanet, 
                                                      spaceship, 
                                                      sum(pathr.distance) as distance,
                                                      journey,
                                                      id(shipment)`)
          session.close()
          if(rawShipments.records.length < 1)
              throw new Error("Unable to find a correct path to simulate this shipment")
          return api.shipments.mapShipmentRecord(rawShipments.records[0])
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
