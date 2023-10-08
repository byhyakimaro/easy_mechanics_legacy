/** COMMANDS ADMIN CLIENT*/

RegisterCommand("kill", (source, args) => {
  SetEntityHealth(GetPlayerPed(-1), 0)
})
