const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

const { someFn } = require('./index')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Demo', () => {
  describe('someFn', () => {
    ///// group 1 - without chai-as-promised
    it('should catch the error - try/catch way', async () => {
      let err

      try {
        err = await someFn()
      } catch (e) {
        // catches rejected promise
        err = e
      }

      expect(err.message).to.equal(`I'm an error!`)
    })

    // I prefer this over previous
    it('should catch the error - .catch() way', async () => {
      await someFn().catch(err => expect(err.message).to.equal(`I'm an error!`)) // PROS: will check whole message // checking err message can sometimes be testing implementation too much though, depending on situation
    })

    ///// group 2 - with use of chai-as-promised

    // my preferred way, plus with this way to can do to.be.rejected whereas with .catch() you need to check message or expect(err).to.exist (this just feels weird)
    it('should catch the error - await expect(...) way', async () => {
      // promise not unwrapped, we're performing assertion on the promise itself
      await expect(someFn()).to.be.rejectedWith(`I'm an error!`)
    })

    it('will not work - expect(await ...)', async () => {
      // not catching, so SOL
      // we should get an unhandled promise rejection though?
      // below will show in console
      // Error: I'm an error!
      //   at someFn (index.js:2:9)
      //   at Context.it.only (test.js:40:20)
      
      // await someFn() // this wont throw unhandled promise rejection either 
      expect(await someFn()).to.be.defined // test won't even blow up because of to.be.defined not being an API
    })

    it('will result in UnhandledPromiseRejection', async () => {
      expect(someFn()).to.be.an.instanceOf(Error)
    })

    it('will kind of work - expect(...)', async () => {
      expect(someFn()).to.be.rejectedWith(`asfdasfd`) // test will pass but with unhandled promise rejection
      expect(someFn()).to.be.rejectedWith(`an error!`) // will pass, no unhandled promsie rejection, this is either behavior or bug from chai-as-promised
      // you wouldn't really do this anyway (leave out await)
    })
  })
})