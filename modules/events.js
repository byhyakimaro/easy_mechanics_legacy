const { spawn_ } = require("./../base/settings.json");

function managerEvents(utils) {

  onNet('EASY:SpawnPlayer', ({model, heading, idx, x, y, z}) => {
      
    console.log({ x, y, z })
    SetEntityCoords(GetPlayerPed(source), spawn_.x, spawn_.y, spawn_.z, true, false, false, false)
  })
}

module.exports = { managerEvents }
