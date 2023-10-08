const { login_ } = require("../base/settings")

async function login(name, setKickReason, deferrals, utils) {
    deferrals.defer()
    const player = global.source;

    setTimeout(() => {
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
        const deferralsMsgUpdate = utils.dynamicRegex(login_.message_updated, stringDynamics)

        deferrals.update(deferralsMsgUpdate)

        //pretend to be a wait
        setTimeout(async () => {
            if (stringDynamics.licenseIdentifier === null) {
                deferrals.done("You are not license to game.")
            } else {
                const user = await utils.query(`SELECT id, license, whitelist FROM userData WHERE license = "${stringDynamics.licenseIdentifier}" and whitelist = 1`)
                
                if (user.length) {
                    deferrals.done()
                } else {
                    const deferralsMsg = utils.dynamicRegex(login_.message_register, stringDynamics)

                    deferrals.done(deferralsMsg)
                    utils.query(`INSERT IGNORE INTO userData (license, whitelist, time) VALUES ("${stringDynamics.licenseIdentifier}", 0, ${Math.floor(Date.now() / 1000)})`)
                }

            }
        }, 0)
    }, 0)
}

module.exports = { login }
