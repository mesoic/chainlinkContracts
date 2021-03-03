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

  // log request path
  const requestId = "0xaed2196c045a000c446053645f0cb586d1aee975a4a8f3481b4489c2668b2351"

  // Load data from request object
  const jsonString = fs.readFileSync( fs_path.resolve(__dirname, "./requests/" + requestId + ".json"))
  const request = JSON.parse(jsonString)

  console.log(request)

  // Note that err is the turffle error handler function which is passed as 
  // an argument to the asynchronous code we write. We can access the source
  // doing console.log(err.toString()).
  module.exports = async truffle_err => {

    // Contract instance
    const mc = await contract.deployed()

    // call createRequestTo (do the transaction)
    console.log('Cancelling request on contract:', mc.address)
    const tx = await mc.cancelRequest(
      request.requestId,
      request.payment,
      request.callbackFunc,
      request.expiration
    )
     
    // print the transaction hash
    console.log("txHash: " + tx.tx)
  
    // call error callback on empty string .
    // This will terminate truffle processes.
    truffle_err(tx.tx)
  }  
} catch(event_err) {
  console.log(event_err)
};
