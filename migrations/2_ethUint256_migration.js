const contract = artifacts.require('ethUint256')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle')

module.exports = (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (!network.startsWith('ropsten')) {
    LinkToken.setProvider(deployer.provider)
    Oracle.setProvider(deployer.provider)

    deployer.deploy(LinkToken, { from: defaultAccount }).then(link => {
    
      return deployer.deploy(Oracle, link.address, { from: defaultAccount })
        .then(() => {
          return deployer.deploy(contract, link.address)
        })
    })
  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    deployer.deploy(contract, '0x0000000000000000000000000000000000000000')
  }
}
