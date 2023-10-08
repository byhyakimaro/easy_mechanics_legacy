const utilsRoot = require("./lib/utils")
const utils = new utilsRoot()

const { loginManager, spawnManager, logoutManager } = require("./modules/connection")
require("./modules/commands")

const tablesDb = [
  'userData (id INT AUTO_INCREMENT PRIMARY KEY, license VARCHAR(40), whitelist INT, time INT, lastPos VARCHAR(90))',
  // 'playerData (id INT AUTO_INCREMENT PRIMARY KEY, data VARCHAR(255))',
  // 'playerInv (id INT AUTO_INCREMENT PRIMARY KEY, data VARCHAR(255))',
  // 'chest (chest VARCHAR(255) PRIMARY KEY, data VARCHAR(255))',
  // 'serverData (id INT AUTO_INCREMENT PRIMARY KEY, data varchar(255))',
]

async function loadBase() {
  try {
    
    await utils.connectDb('easymechanics')
    
    tablesDb.forEach(async table => {
      await utils.queryDb(`CREATE TABLE IF NOT EXISTS ${table}`)
    })

    on('playerConnecting', (...args) => loginManager(...args, utils))
    onNet('EASY:SpawnPlayer', ({model, heading, idx, x, y, z}) => spawnManager(model, heading, idx, x, y, z, utils))
    on('playerDropped', (...args) => logoutManager(...args, utils))
  
  } catch (error) {
    console.log(error)
  }
}; loadBase()
