  /**
   * @param {String} source 
   * @param {String} utils 
   * @returns {String} string
   */

async function getId(source, utils) {
  const licenseIdentifier = await utils.getIdentifier(source, 'license')

  return ((await utils.queryDb(`SELECT id, license FROM userData WHERE license = "${licenseIdentifier}"`))[0].id)
}

module.exports = { getId }