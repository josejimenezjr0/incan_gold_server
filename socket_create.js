const { v4: uuidv4 } = require('uuid')
const chalk = require('chalk')
const { makePlayer_Game } = require('./lib/gameAssets')

module.exports = (socket, players, games) => {
  return socket.on("create", startInfo => {
    const uuid = uuidv4()
    socket.emit("uuid", uuid)
    const room = Math.random().toString(36).substring(2, 6)
    console.log(chalk`{bgGreen.black.bold  ${uuid.substring(0,4)} }{green  created and joined room: }{bgGreen.black.bold  ${room} }`)

    //verify same room name doesn't already exist
    if (!games.hasOwnProperty(room)) {
      [players[uuid], games[room]] = makePlayer_Game(startInfo, uuid, room, socket.id, players, games)

      //add socket to created game and send back game info minus deck
      socket.join(room)
      socket.emit("update", { ...games[room], deck: null })
      socket.emit("playerUpdate", players[uuid])
    } else console.log('Room name already exists')
  })
}