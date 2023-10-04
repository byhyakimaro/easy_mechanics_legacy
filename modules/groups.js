const utilsMYSQL = require("../lib/utils")
const database = new utilsMYSQL()
const fs = require("fs")

class MayhemGroups {
    async getSource(userId, sources) {
        const data = await fs.readFileSync("base/groups.json", "utf8")
        const player = await database.query(`SELECT id, data FROM playerData WHERE id = "${userId}"`)
        const Json = JSON.parse(data)
    }
}