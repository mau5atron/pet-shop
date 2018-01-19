pragma solidity ^0.4.17;

// assertion checks for things like equality, inequality or emptiness to return a pass/fail
// from our test
import "truffle/Assert.sol";

// When running tests, truffle will deploy a fresh instance of the contract being tested to the blockchain. This smart contract // gets the address of the deployed contract.
import "truffle/DeployedAddresses.sol";

// The smart contract that will be tested
import "../contracts/Adoption.sol";

// contract wide variable that contains the smart contract 
// to be tested, calling the DeployedAddresses smart contract to get its address.
contract TestAdoption {
  Adoption adoption = Adoption(DeployedAddresses.Adoption());

  //testing adopt() function
  function testUserCanAdoptPet() public {
  	uint returnId = adoption.adopt(8);

  	uint expected = 8;

  	Assert.equal(returnId, expected, "Adoption of pet ID 8 should be recorded.");
  }

  // Testing the retrieval of a single pets owner
  function testGetAdopterAddressByPetId() public {
  	// expected owner of this contract
  	address expected = this;

  	address adopter = adoption.adopters(8);

  	Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
  }

  // Testing retrieval of all pet owners 
  function testGetAdopterAddressByPetIdInArray() public {
  	// expected owner of this contract 
  	address expected = this;

  	// store adopters in memory rather than contract's storage
  	address[16] memory adopters = adoption.getAdopters();

  	Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");	
  }

}









