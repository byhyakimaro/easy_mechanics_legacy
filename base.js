const utilsMYSQL = require("./lib/utils")
const database = new utilsMYSQL()

const { Login } = require("./modules/login")

const tablesDb = [
  'userData (id INT AUTO_INCREMENT PRIMARY KEY, license VARCHAR(40), whitelist INT, time INT)',
  // 'playerData (id INT AUTO_INCREMENT PRIMARY KEY, data VARCHAR(255))',
  // 'playerInv (id INT AUTO_INCREMENT PRIMARY KEY, data VARCHAR(255))',
  // 'chest (chest VARCHAR(255) PRIMARY KEY, data VARCHAR(255))',
  // 'serverData (id INT AUTO_INCREMENT PRIMARY KEY, data varchar(255))',
]

async function loadBase() {
  try {
    await database.connect('easymechanics')
    
    tablesDb.forEach(async table => {
      await database.query(`CREATE TABLE IF NOT EXISTS ${table}`)
    })
    
    on('playerConnecting', (...args) => Login(...args, database))
    
  } catch (error) {
    console.log(error)
  }
}; loadBase()
