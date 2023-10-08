const utilsMYSQL = require("../lib/utils")
const Player = require("./player")
const database = new utilsMYSQL()

class MayhemRegistry {
    async Insert(licenseIdentifier) {
        await database.connect("mayhem")
        const data = await database.query(`SELECT id, license FROM userData WHERE license = "${licenseIdentifier}"`)
        if (data.length) return
        database.query(`INSERT IGNORE INTO userData (license, whitelist, ban, time) VALUES ("${licenseIdentifier}", 0, 0, ${Math.floor(Date.now() / 1000)})`)
        database.query("INSERT IGNORE INTO playerData (name, lastname) VALUES ('Individuo', 'Indigente')")
        database.query("INSERT IGNORE INTO playerInv (data) VALUES ('Em Breve')")
        database.query("INSERT IGNORE INTO playerJobs (job) VALUES ('Desempregado')")
    }

    async checkBan(licenseIdentifier) {
        await database.connect("mayhem")
        const data = await database.query(`SELECT id, license, ban FROM userData WHERE license = "${licenseIdentifier}"`)
        for (let user of data) {
            if (user.ban == 1) return true
        }
        return false
    }
}

module.exports = MayhemRegistry;
