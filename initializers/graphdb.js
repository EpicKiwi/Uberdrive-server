'use strict'

const neo4j = require("neo4j-driver").v1

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    api.graphdb = {
        host: "bolt://localhost",
        username: "neo4j",
        password: "kiwi",
        connection: null,
        session: null
    }
    return next()
  },
  start: function (api, next) {
    api.connection = neo4j.driver(api.graphdb.host, neo4j.auth.basic(api.graphdb.username,api.graphdb.password))
    api.session = api.connection.session()
    return next()
  },
  stop: function (api, next) {
      api.session.close(()=>{
          api.session = null
          api.connection.close()
          api.connection = null
          return next()
      })
  }
}
