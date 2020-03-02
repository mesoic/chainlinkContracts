// File system for configuration
const fs = require('fs')

// For HD wallet generation
const HDWalletProvider = require("@truffle/hdwallet-provider");

// Load data into variables
try {
  const jsonString = fs.readFileSync(".config.json")
  const config = JSON.parse(jsonString)

  // Export modules
  module.exports = {
    networks: {

      ganache: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*"
      },
    
      ropsten: {
        provider: new HDWalletProvider(config.ROPSTEN_HD_MNEMONIC, config.ROPSTEN_EAAS + config.ROPSTEN_API_KEY, config.ROPSTEN_HD_INDEX),
        network_id: 3,
        gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
      },

      mainnet: {
        provider: new HDWalletProvider(config.MAINNET_HD_MNEMONIC, config.MAINNET_EAAS + config.MAINNET_API_KEY, config.MAINNET_HD_INDEX),
        network_id: 1,
        gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
      }
    }

  }
} catch(err) {
  console.log(err)
  return
};
