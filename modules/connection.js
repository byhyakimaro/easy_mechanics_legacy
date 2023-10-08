const { spawn_ } = require("./../base/settings.json");
const { login_ } = require("../base/settings")

const proxyClass = require("../lib/proxy")
const proxy = new proxyClass()

const toolClass = require("../lib/tools")
const tools = new toolClass()

async function loginManager(name, setKickReason, deferrals, utils) {
	deferrals.defer()
	const userSource = source

	setTimeout(async() => {
		const stringDynamics = {
			name: name,
			licenseIdentifier: await proxy.getIdentifier(userSource, 'license')
		}

		const deferralsMsgUpdate = tools.dynamicRegex(login_.message_done, stringDynamics)
		deferrals.update(deferralsMsgUpdate)

		//pretend to be a wait
		setTimeout(async () => {
			if (stringDynamics.licenseIdentifier === null) {
				deferrals.done("You are not license to game.")
			} else {
				const user = await utils.queryDb(`SELECT id, license, whitelist FROM userData WHERE license = "${stringDynamics.licenseIdentifier}"`)
				const deferralsMsg = tools.dynamicRegex(login_.message_register, stringDynamics)

				if (user.length) {
					if (user[0].whitelist != 1) {
						deferrals.done(deferralsMsg)
					} else {
						deferrals.done()
					}
				} else {
					deferrals.done(deferralsMsg)

					utils.queryDb(`INSERT IGNORE INTO userData (license, whitelist, time, lastPos) VALUES ('${stringDynamics.licenseIdentifier}', 0, ${Math.floor(Date.now() / 1000)}, '${JSON.stringify({ x: spawn_.x, y: spawn_.y, z: spawn_.z })}')`)
				}

			}
		}, 0)
	}, 0)
}

const playersInGame = []

async function spawnManager(model, heading, idx, x, y, z, utils) {

	const userSourceInGame = source
	const playerPed = GetPlayerPed(userSourceInGame)
	const userId = await proxy.getId(userSourceInGame, utils)

	if (!playersInGame.includes(userId)) {
		const queryPos = await utils.queryDb(`SELECT id, lastPos FROM userData WHERE id = '${userId}'`)
		const { x, y, z } = JSON.parse(queryPos[0].lastPos)
		playersInGame.push(userId)

		utils.debug && console.log("Joined", playersInGame)
		SetEntityCoords(playerPed, x, y, z, true, false, false, false)
	}	else {
		
		SetEntityCoords(playerPed, spawn_.x, spawn_.y, spawn_.z, true, false, false, false)
	}
}

async function logoutManager(reasonDrop, utils) {
	utils.debug && console.log(reasonDrop, playersInGame)

	const userSourceInGame = source
	const playerPed = GetPlayerPed(userSourceInGame)
	const userId = await proxy.getId(userSourceInGame, utils)

	const [playerX, playerY, playerZ] = GetEntityCoords(playerPed)
	playersInGame.splice(playersInGame.indexOf(userId), 1)

	utils.queryDb(`UPDATE userData SET time = ${Math.floor(Date.now() / 1000)}, lastPos = '${JSON.stringify({ x: playerX, y: playerY, z: playerZ })}' WHERE id = '${userId}'`)
}

module.exports = { loginManager, spawnManager, logoutManager }
