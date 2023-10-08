RegisterCommand('cds', (source) => {
  const ped = GetPlayerPed(source)
  const [playerX, playerY, playerZ] = GetEntityCoords(ped)
  
  console.log({ x: playerX, y: playerY, z: playerZ })
})
