// Load contract instance
const contract = artifacts.require('externalAdapter')

/*
  This script allows for a Chainlink request to be created from
  the requesting contract. Defaults to the Chainlink oracle address
  on this page: https://docs.chain.link/docs/testnet-oracles
*/

try {

  // Note that err is the turffle error handler function which is passed as 
  // an argument to the asynchronous code we write. We can access the source
  // doing console.log(err.toString()).
  module.exports = async truffle_err => {

    // Contract instance
    const mc = await contract.deployed()

    // call createRequestTo (do the transaction)
    console.log('Withdrawing LINK from contract:', mc.address)
    const tx = await mc.withdrawLink()
     
    // print the transaction hash
    console.log("txHash: " + tx.tx)
  
    // call error callback on empty string .
    // This will terminate truffle processes.
    truffle_err(tx.tx)
  }  
} catch(event_err) {
  console.log(event_err)
};
