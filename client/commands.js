RegisterCommand('cds', (source) => {
  const ped = GetPlayerPed(source)
  const [playerX, playerY, playerZ] = GetEntityCoords(ped)
  
  console.log([playerX, playerY, playerZ]) 
})
