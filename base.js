const utilsClass = require("./lib/utils")
const ManagerEvents = require("./modules/events")

const utils = new utilsClass()

const tablesDb = [
  'userData (id INT AUTO_INCREMENT PRIMARY KEY, license VARCHAR(40), whitelist INT, time INT, lastPos VARCHAR(90))',
  'groups (id INT AUTO_INCREMENT PRIMARY KEY, group VARCHAR(40))',
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
    new ManagerEvents(utils).load()
  
  } catch (error) {
    console.log(error)
  }
}; loadBase()
