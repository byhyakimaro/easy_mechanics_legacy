// const { spawn_ } = require("./../base/settings.json");

// const playersInGame = {}

// function managerEvents(utils) {

//   onNet('EASY:SpawnPlayer', ({model, heading, idx, x, y, z}) => {
//     const playerPed = GetPlayerPed(source)
    
//     console.log({ x, y, z })
//     SetEntityCoords(playerPed, spawn_.x, spawn_.y, spawn_.z, true, false, false, false)
//   })
// }

// module.exports = { managerEvents }
const ManagerCommands = require("./commands")
const { loginManager, spawnManager, logoutManager } = require("./connection")

class ManagerEvents {
  constructor(utils) {
    this.utils = utils
  }

  load(...data) {
    new ManagerCommands(this.utils).load()

    on('playerConnecting', (...args) => loginManager(...args, this.utils))
    onNet('EASY:SpawnPlayer', ({model, heading, idx, x, y, z}) => spawnManager(model, heading, idx, x, y, z, this.utils))
    on('playerDropped', (...args) => logoutManager(...args, this.utils))
  }
}
module.exports = ManagerEvents
