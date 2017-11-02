'use strict'

const neo4j = require("neo4j-driver").v1

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.graphdb = {
        host: "bolt://db/",
        username: "neo4j",
        password: "kiwi",
        connection: null
    }

    api.graphdb.getSession = function getSession(){
        return api.graphdb.connection.session()
    }

    api.graphdb.mapRecords = function mapRecords(dbResult,additionnalCallback){
        return dbResult.records.map((el,index,recordList)=>{
            let record = api.graphdb.mapNode(el["_fields"][0])
            if(additionnalCallback)
                additionnalCallback(record,el,index,recordList)
            return record
        })
    }

    api.graphdb.mapNode = function mapNode(rawField){
        let record = {}
        Object.keys(rawField["properties"]).forEach((key)=>{
            let property =  rawField["properties"][key]
            switch(typeof property) {
                case "object":
                    record[key] = property.low
                    break;
                default:
                    record[key] = property
                    break;
            }
        })
        return record
    }

    return next()
  },
  start: function (api, next) {
    api.log("Connecting to database")
      api.graphdb.connection = neo4j.driver(api.graphdb.host, neo4j.auth.basic(api.graphdb.username,api.graphdb.password))
      return next()
  },
  stop: function (api, next) {
      api.graphdb.connection.close()
      return next()
  }
}
