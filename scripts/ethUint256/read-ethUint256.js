const contract = artifacts.require('ethUint256')

/*
  This script makes it easy to read the data variable
  of the requesting contract.
*/

module.exports = async callback => {
  const mc = await contract.deployed()
  const data = await mc.data.call()
  callback(data)
}
