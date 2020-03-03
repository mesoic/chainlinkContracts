// File system for configuration
const fs = require('fs')
const fs_path = require("path");

// Load contract instance
const contract = artifacts.require('externalAdapter')

// Chainlink helpers
const { oracle } = require('@chainlink/test-helpers')

// Open-zeppelin helpers
require('openzeppelin-test-helpers/configure')({ web3 }); 
const { expectRevert, time } = require('openzeppelin-test-helpers')

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

    // Contract instance
    const mc = await contract.deployed()

    // call createRequestTo
    console.log('Creating request on contract:', mc.address)
    const tx = await mc.createRequestTo(
      config.oracleAddress,
      web3.utils.toHex(config.jobId),
      config.payment
    )

  
    // Get request object from tx.reciept
    const request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
    
    // Log request data
    console.log(request.requestId)
    console.log(request.payment)
    console.log(request.callbackFunc)
    console.log(request.expiration)

    // Do the transaction    
    callback(tx.tx)
  }  
} catch(err) {
  console.log(err)
};
