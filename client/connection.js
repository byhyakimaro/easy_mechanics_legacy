on('playerSpawned', (...args) => {
  console.log(...args)
  emitNet('EASY:SpawnPlayer', ...args)
})
