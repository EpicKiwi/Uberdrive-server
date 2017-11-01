'use strict'

const crypto = require('crypto');

module.exports = {
  loadPriority: 1010,
  startPriority: 1010,
  stopPriority: 1010,
  initialize: function (api, next) {
    api.users = {}

    api.users.register = async function registerUser(username,password){

        let session = api.graphdb.getSession()
        let existingUser = await session.run(`MATCH (u:User) WHERE u.name =~ "(?ui)${username}" RETURN u`)
        if(existingUser.records.length > 0)
          throw new Error("This user already exists")
        let result = await session.run(`CREATE (u:User {name:"${username}",password:"${password}"}) RETURN u`)
        if(result.summary.counters["_stats"].nodesCreated < 1)
            throw new Error("The user wasn't created")
        session.close()
        return {
          username: api.graphdb.mapRecords(result)[0].name
        }
    }

    api.users.generateToken = function generateUserToken(){
      return crypto.randomBytes(50).toString("hex");
    }

    api.users.createToken = async function createToken(username, password, restrictIp){

      let session = api.graphdb.getSession()
      let rawUser = await session.run(`MATCH (u:User) WHERE u.name =~ "(?ui)${username}" AND u.password = "${password}" RETURN u`)
      if(rawUser.records.length < 1)
        throw new Error("Bad username or password")
      let authToken = api.users.generateToken();
      let result = await session.run(`MATCH (u:User) 
                                      WHERE u.name =~ "(?ui)${username}" 
                                      CREATE (t:Token {token:"${authToken}",ip:"${restrictIp}"})-[:Authenticates]->(u) 
                                      RETURN u,t`)
      if(result.summary.counters["_stats"].nodesCreated < 1)
        throw new Error("The token wasn't created")
      session.close()

        return {
          username: api.graphdb.mapRecords(rawUser)[0].name,
          token: authToken,
          ip: restrictIp
        }
    }

    api.users.authenticate = async function authenticateUser(tokenValue){
        let session = api.graphdb.getSession()
        let rawUser = await session.run(`MATCH (t:Token)-[:Authenticates]->(u:User) WHERE t.token = "${tokenValue}" RETURN u,t`)
        if(rawUser.records.length < 1)
            throw new Error("Bad token")
        session.close()
        return {
            username: api.graphdb.mapRecords(rawUser)[0].name,
            token: tokenValue,
        }
    }

    api.users.getByName = async function getUserByName(username){
        let session = api.graphdb.getSession()
        let rawUser = await session.run(`MATCH (u:User) WHERE u.name =~ "(?ui)${username}" OPTIONAL MATCH (u)-[r:LocatedOn]->(l:Planet) RETURN u,l`)
        if(rawUser.records.length < 1)
            return null
        session.close()
        return api.graphdb.mapRecords(rawUser,(record,rawRecord) => {
          record.password = undefined
          record.location = rawRecord["_fields"][1] ? api.graphdb.mapNode(rawRecord["_fields"][1]) : null
        })[0]
    }

    const authenticationMiddleware = {
          name: "authentication",
          global: true,
          priority: 1010,
          preProcessor: async (data,next)=>{
            if(data.actionTemplate.authentication === false)
              return next(null)
            if(!data.params.token){
                return next(new Error("This api require a authentication token in parameter 'token'"))
            }
            let authResult = null
            try{
              authResult = await api.users.authenticate(data.params.token)
            } catch(e){
              return next(e)
            }
            data.authentication = authResult
            data.response.authToken = {
              authenticated: true,
              username: authResult.username
            }
            return next(null)
          }
    }

    api.actions.addMiddleware(authenticationMiddleware)

    return next()
  },

  start: function (api, next) {
    return next()
  },
  stop: function (api, next) {
    return next()
  }
}
