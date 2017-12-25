'use strict'

module.exports = (service) => {
  class Home {
    async index () {
      console.log('----->', this.session)
      this.status = 200
      this.body = 'hi, fuzi'
    }
  }
  return new Home()
}
