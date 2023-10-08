/** COMMANDS ADMIN SERVER*/

class ManagerCommands {
  constructor(utils) {
    this.utils = utils
  }

  load() {

    RegisterCommand('cds', (source) => {
      const ped = GetPlayerPed(source)
      const [playerX, playerY, playerZ] = GetEntityCoords(ped)
      
      console.log({ x: playerX, y: playerY, z: playerZ })
    })
  }

}
module.exports = ManagerCommands
