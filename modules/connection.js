const { spawn_ } = require("./../base/settings.json");
const { login_ } = require("../base/settings")

async function loginManager(name, setKickReason, deferrals, utils) {
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

					utils.queryDb(`INSERT IGNORE INTO userData (license, whitelist, time, lastPos) VALUES ("${stringDynamics.licenseIdentifier}", 0, ${Math.floor(Date.now() / 1000)}, ["x":0,"y":0,"z":0])`)
				}

			}
		}, 0)
	}, 0)
}

const playersInGame = []

async function spawnManager(model, heading, idx, x, y, z, utils) {
	const playerPed = GetPlayerPed(source)
	
	if(!playersInGame.includes(playerPed)) {
		playersInGame.push(playerPed)
	
		utils.debug && console.log({ x, y, z }, playersInGame)
		SetEntityCoords(playerPed, spawn_.x, spawn_.y, spawn_.z, true, false, false, false)
	}
}

async function logoutManager(reasonDrop, utils) {
	utils.debug && console.log(reasonDrop)
	const userId = global.source;
	const playerPed = GetPlayerPed(source)
	const [playerX, playerY, playerZ] = GetEntityCoords(playerPed)

	playersInGame.splice(playersInGame.indexOf(playerPed), 1)
	utils.queryDb(`UPDATE userData SET last_cds = '${JSON.stringify([playerX, playerY, playerZ])}' WHERE id = '${userId}'`)
	utils.queryDb(`UPDATE userData SET time = ${Math.floor(Date.now() / 1000)} AND WHERE id = '${userId}'`)
}

module.exports = { loginManager, spawnManager, logoutManager }
