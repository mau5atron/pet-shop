var Adoption = artifacts.require("Adoption");
// Line below deploys smart contract to local blockchain
module.exports = function(deployer){
	deployer.deploy(Adoption);
};