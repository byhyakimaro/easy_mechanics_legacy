const utilsMYSQL = require("../lib/utils")

const database = new utilsMYSQL()
const { login } = require("../base/config")

on('playerConnecting', async (name, setKickReason, deferrals) => {
    deferrals.defer()
    const player = global.source;

    await database.connect('mayhem')

    setTimeout(() => {
        deferrals.update(`Hello ${name}. Your license is being checked.`)

        let licenseIdentifier = null;

        for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
            const identifier = GetPlayerIdentifier(player, i);

            database.debug && console.log(identifier)
            if (identifier.includes('license:')) {
                licenseIdentifier = identifier.replace(/[^:]+:(.+)/, '$1');
            }
        }

        //pretend to be a wait
        setTimeout(async () => {
            if (licenseIdentifier === null) {
                deferrals.done("You are not license to game.")
            } else {
                const user = await database.query(`SELECT id, license, whitelist FROM userData WHERE license = "${licenseIdentifier}" and whitelist = 1`)
                
                if (user.length) {
                    deferrals.done()
                } else {
                    deferrals.done(`join in us discord ${login.discord_invite} and approve your license to whitelist: ${licenseIdentifier}`)
                    database.query(`INSERT IGNORE INTO userData (license, whitelist, time) VALUES ("${licenseIdentifier}", 0, ${Math.floor(Date.now() / 1000)})`)
                }

            }
        }, 0)
    }, 0)
})
