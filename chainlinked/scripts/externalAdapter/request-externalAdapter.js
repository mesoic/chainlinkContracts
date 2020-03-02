// File system for configuration
const fs = require('fs')
const fs_path = require("path");

// Load contract instance
const contract = artifacts.require('externalAdapter')

/*
  This script allows for a Chainlink request to be created from
  the requesting contract. Defaults to the Chainlink oracle address
  on this page: https://docs.chain.link/docs/testnet-oracles
*/

try {

  // Load data from request object
  const jsonString = fs.readFileSync( fs_path.resolve(__dirname, "./requests/oracle-cryptoCompare-LINKUSD.json") )
  const config = JSON.parse(jsonString)

  // Build request callback
  module.exports = async callback => {
    const mc = await contract.deployed()
    console.log('Creating request on contract:', mc.address)
    const tx = await mc.createRequestTo(
      config.oracleAddress,
      web3.utils.toHex(config.jobId),
      config.payment
    )
    callback(tx.tx)
  }
} catch(err) {
  console.log(err)
};
