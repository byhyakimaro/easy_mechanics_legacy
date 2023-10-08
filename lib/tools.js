class Tools {
  /**
   * @param {String} stringOriginal 
   * @param {Array} stringDynamics 
   * @returns {String} string
   */
  dynamicRegex(stringOriginal, stringDynamics) {
    return stringOriginal.replace(/%(\w+)%/g, function (match, p1) {
      if (stringDynamics.hasOwnProperty(p1)) {
        return stringDynamics[p1]
      } else {
        return match
      }
    })
  }
}

module.exports = Tools
