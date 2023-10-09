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
