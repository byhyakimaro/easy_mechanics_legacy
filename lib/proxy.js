class Proxy {
  // constructor(utils) {
  //   this.utils = utils
  // }

  getIdentifier(source, typeIdentifier, utils) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);
        utils.debug && console.log(identifier)
  
        if (identifier.includes(`${typeIdentifier}:`)) {
          resolve(identifier.replace(/[^:]+:(.+)/, '$1'))
        }
      }
    })
  }

  async getId(source, utils) {
    const licenseIdentifier = await this.getIdentifier(source, 'license', utils)
  
    return ((await utils.queryDb(`SELECT id, license FROM userData WHERE license = "${licenseIdentifier}"`))[0].id)
  }
}

module.exports = Proxy
