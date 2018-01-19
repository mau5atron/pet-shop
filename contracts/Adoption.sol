pragma solidity ^0.4.17;

contract Adoption {
	address[16] public adopters;
	// adopters is a variable that is an array of ethereum addresses.
	// the array is limited to a variable length of 16

	// Function to adopt a pet
	function adopt(uint petId) public returns (uint){
		// checks to make sure petId is within 16 range
		require(petId >= 0 && petId <= 15);
		// msg.sender denotes the address of the person or smart 
		// contract that called the function.
		adopters[petId] = msg.sender;
		// petId is returned as a confirmation
		return petId;
	}

	// Retrieving adopters 
	// function calls the adopters
	function getAdopters() public view returns (address[16]){
		// since adopters is already declared we simply call it.
		return adopters;
	}
}