const { spawn_ } = require("./../base/settings.json");
const { login_ } = require("../base/settings")

async function loginManager(name, setKickReason, deferrals, utils) {
	deferrals.defer()
	const userId = global.source;

	setTimeout(async() => {
		const stringDynamics = {
			name: name,
			licenseIdentifier: await this.getIdentifier(source, 'license')
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
					if (user[0].whitelist != 1) {
						deferrals.done(deferralsMsg)
					} else {
						deferrals.done()
					}
				} else {
					deferrals.done(deferralsMsg)

					utils.queryDb(`INSERT IGNORE INTO userData (license, whitelist, time, lastPos) VALUES ('${stringDynamics.licenseIdentifier}', 0, ${Math.floor(Date.now() / 1000)}, '${JSON.stringify({ x: 0, y: 0, z: 0 })}')`)
				}

			}
		}, 0)
	}, 0)
}

const playersInGame = []

async function spawnManager(model, heading, idx, x, y, z, utils) {
	const userSource = source
	const userId = await utils.getId(userSource)
	const playerPed = GetPlayerPed(userId)

	if (!playersInGame.includes(playerPed)) {
		const queryPos = await utils.queryDb(`SELECT id, lastPos FROM userData WHERE id = '${userId}'`)
		const { x, y, z } = JSON.parse(queryPos[0].lastPos)
		playersInGame.push(userId)

		utils.debug && console.log(playersInGame, userId)
		SetEntityCoords(playerPed, x, y, z, true, false, false, false)
	}	else {
		
		SetEntityCoords(playerPed, spawn_.x, spawn_.y, spawn_.z, true, false, false, false)
	}
}

async function logoutManager(reasonDrop, utils) {
	utils.debug && console.log(reasonDrop, playersInGame)

	const userSource = source
	const userId = await utils.getId(userSource)
	const playerPed = GetPlayerPed(userId)

	const [playerX, playerY, playerZ] = GetEntityCoords(playerPed)

	playersInGame.splice(playersInGame.indexOf(playerPed), 1)
	utils.queryDb(`UPDATE userData SET time = ${Math.floor(Date.now() / 1000)}, lastPos = '${JSON.stringify({ x: playerX, y: playerY, z: playerZ })}' WHERE id = '${userId}'`)
}

module.exports = { loginManager, spawnManager, logoutManager }
