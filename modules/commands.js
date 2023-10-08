RegisterCommand('cds', (source) => {
  const ped = GetPlayerPed(source)
  const [playerX, playerY, playerZ] = GetEntityCoords(ped)
  
  return [playerX, playerY, playerZ]
})
