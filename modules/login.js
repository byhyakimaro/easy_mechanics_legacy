const { login_ } = require("../base/settings")

async function login(name, setKickReason, deferrals, utils) {
    deferrals.defer()
    const player = global.source;

    setTimeout(() => {
        deferrals.update(`Hello ${name}. Your license is being checked.`)

        const stringDynamics = {
            name: name,
            licenseIdentifier: null
        }

        for (let i = 0; i < GetNumPlayerIdentifiers(player); i++) {
            const identifier = GetPlayerIdentifier(player, i);

            utils.debug && console.log(identifier)
            if (identifier.includes('license:')) {
                stringDynamics.licenseIdentifier = identifier.replace(/[^:]+:(.+)/, '$1');
            }
        }

        //pretend to be a wait
        setTimeout(async () => {
            if (stringDynamics.licenseIdentifier === null) {
                deferrals.done("You are not license to game.")
            } else {
                const user = await utils.query(`SELECT id, license, whitelist FROM userData WHERE license = "${stringDynamics.licenseIdentifier}" and whitelist = 1`)
                
                if (user.length) {
                    deferrals.done()
                } else {
                    const deferralsMsg = login_.message_register.replace(/%(\w+)%/g, function(match, p1) {
                        if (stringDynamics.hasOwnProperty(p1)) {
                            return stringDynamics[p1]
                        } else {
                            return match
                        }
                    })

                    deferrals.done(deferralsMsg)
                    utils.query(`INSERT IGNORE INTO userData (license, whitelist, time) VALUES ("${stringDynamics.licenseIdentifier}", 0, ${Math.floor(Date.now() / 1000)})`)
                }

            }
        }, 0)
    }, 0)
}

module.exports = { login }
