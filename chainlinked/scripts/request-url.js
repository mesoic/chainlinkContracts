// File system for configuration
const fs = require('fs')

// Load contract instance
const MyContract = artifacts.require('MyContract')

/*
  This script allows for a Chainlink request to be created from
  the requesting contract. Defaults to the Chainlink oracle address
  on this page: https://docs.chain.link/docs/testnet-oracles
*/

try {

  // Load data from request object
  const jsonString = fs.readFileSync("./requests/oracle-request-url.json")
  const config = JSON.parse(jsonString)

  // Build request callback
  module.exports = async callback => {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)
    const tx = await mc.createRequestTo(
      config.oracleAddress,
      web3.utils.toHex(config.jobId),
      config.payment,
      config.url,
      config.path,
      config.times,
    )
    callback(tx.tx)
  }
} catch(err) {
  console.log(err)
};
