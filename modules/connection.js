const { login_ } = require("../base/settings")

async function login(name, setKickReason, deferrals, utils) {
    deferrals.defer()
    const userId = global.source;

    setTimeout(() => {
        const stringDynamics = {
            name: name,
            licenseIdentifier: null
        }
        
        for (let i = 0; i < GetNumPlayerIdentifiers(userId); i++) {
            const identifier = GetPlayerIdentifier(userId, i);
            
            utils.debug && console.log(identifier)
            if (identifier.includes('license:')) {
                stringDynamics.licenseIdentifier = identifier.replace(/[^:]+:(.+)/, '$1');
            }
        }

        const deferralsMsgUpdate = utils.dynamicRegex(login_.message_done, stringDynamics)
        deferrals.update(deferralsMsgUpdate)

        //pretend to be a wait
        setTimeout(async () => {
            if (stringDynamics.licenseIdentifier === null) {
                deferrals.done("You are not license to game.")
            } else {
                const user = await utils.queryDb(`SELECT id, license, whitelist FROM userData WHERE license = "${stringDynamics.licenseIdentifier}"`)
                const deferralsMsg = utils.dynamicRegex(login_.message_register, stringDynamics)
                
                if (user.length) {
                    if( user[0].whitelist != 1) {
                        deferrals.done(deferralsMsg) 
                    } else { 
                        deferrals.done()
                    }
                } else {
                    deferrals.done(deferralsMsg)

                    utils.queryDb(`INSERT IGNORE INTO userData (license, whitelist, time) VALUES ("${stringDynamics.licenseIdentifier}", 0, ${Math.floor(Date.now() / 1000)})`)
                }

            }
        }, 0)
    }, 0)
}

async function logout(reasonDrop, utils) {
    utils.debug && console.log(reasonDrop)
    const userId = global.source;

    console.log(GetNumPlayerIdentifiers(userId))
}

module.exports = { login, logout }
