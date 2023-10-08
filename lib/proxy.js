class proxy {
  // constructor(utils) {
  //   this.utils = utils
  // }

  async getId(source, utils) {
    const licenseIdentifier = await utils.getIdentifier(source, 'license')
  
    return ((await utils.queryDb(`SELECT id, license FROM userData WHERE license = "${licenseIdentifier}"`))[0].id)
  }
}

module.exports = proxy
