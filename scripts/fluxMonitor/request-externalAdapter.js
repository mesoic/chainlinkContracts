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
  const jsonString = fs.readFileSync( fs_path.resolve(__dirname, "./jobs/oracle-cryptoCompare-LINKUSD.json") )
  //const jsonString = fs.readFileSync( fs_path.resolve(__dirname, "./jobs/oracle-failing.json") )
  const config = JSON.parse(jsonString)

  // Note that err is the turffle error handler function which is passed as 
  // an argument to the asynchronous code we write. We can access the source
  // doing console.log(err.toString()).
  module.exports = async truffle_err => {

    // Contract instance
    const mc = await contract.deployed()

    // call createRequestTo (do the transaction)
    console.log('Creating request on contract:', mc.address)
    const tx = await mc.createRequestTo(
      config.oracleAddress,
      web3.utils.toHex(config.jobId),
      config.payment
    )
      
    // Get request object from tx.reciept
    var request = oracle.decodeRunRequest(tx.receipt.rawLogs[3])
    
    // Add transaction hash to request object
    request.txHash = tx.tx

    // Print out request object    
    console.log(request)

    // Save the request object into a datafile
    fs.writeFileSync(fs_path.resolve(__dirname, "./requests/" + request.requestId + ".json"), JSON.stringify(request, null, 2))

    // call error callback on empty string .
    // This will terminate truffle processes.
    truffle_err(tx.tx)
  }  
} catch(event_err) {
  console.log(event_err)
};
