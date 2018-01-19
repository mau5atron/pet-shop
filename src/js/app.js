App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
   // checks to see if there
   // is an injected instance of web3
   if(typeof web3 !== 'undefined'){
    App.web3Provider = web3.currentProvider;
   } else {
    // If there is no instance of web3 Ganache will be used
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
   }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data){
      // Gets necessary contract artifact file and instantiates it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance){
      adoptionInstance = instance;

      // using call() reads data from the blockchain without having to 
      // send a full transaction/ not sending any ether 
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters){
      // After call we loop through all of the pets to see 
      // if there is an address associated with a pet
      for(i = 0; i < adopters.length; ++i){
        if(adopters[i] !== '0x0000000000000000000000000000000000000000'){
          // When a pet is found to have an address associated with it 
          // the adopt button is then disabled and changed to success
          // meaning the transaction was made and the pet was adopted
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err){
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;
    // using web3 to get user's accounts
    web3.eth.getAccounts(function(error, accounts){
      if(error){
        console.log(error);
      }
      // after callback error the first account is selected
      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance){
        // The deployed contract get stored in an the instance 
        // adoptionInstanceq
        adoptionInstance = instance;

        // return adoptionInstance and transaction gets made
        // transactions have an associated cost. Cost is called 
        // Gas, is paid in ether
        return adoptionInstance.adopt(petId, {from: account});
        // If no errors are found then 
        // then we ge the transaction object
      }).then(function(result){
        // once transaction is made the
        // markAdopted function gets called to 
        // sync UI with newly stored data.
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
