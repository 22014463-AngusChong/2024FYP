import React, { Component } from 'react'; 

class Main extends Component { 
    render() { 
        const { listOfPets } = this.props; 
        const availablePetsCount = listOfPets.reduce((count, pet) => { 
            return JSON.parse(pet.status) ? count + 1 : count; 
        }, 0); 
        const soldPetsCount = listOfPets.length - availablePetsCount; 

        return ( 
            <div class="container"> 
                <h1>Pete's Pet Shop</h1> 
                <h2>Total Number of Pets Available: {availablePetsCount}</h2> 
                <h2>Total Number of Pets Sold: {soldPetsCount}</h2> 
                <h4>Account: {this.props.account}</h4> 
                 
                <hr /> 
                <br /> 
                <div id="petsRow" class="row"> 
                    {listOfPets.map((pet, key) => {   
                        return (                            
                            <div class="col-sm-6 col-md-4 col-lg-3"> 
                                <div key={key} id="petTemplate"> 
                                    <div class="panel panel-default panel-pet"> 
                                        <div class="panel-heading"> 
                                            <h2>{pet.petId}</h2> 
                                            <h3 class="panel-title">{pet.name}</h3> 
                                        </div> 
                                        <div class="panel-body"> 
                                            <img alt="140x140" width="200" data-src="holder.js/140x140"  
                                            class="img-rounded img-center" 
                                                src={pet.picName} data-holder-rendered="true" /> 
                                            <br /><br /> 
                                            <strong>Breed</strong>: <span class="pet-breed">{pet.breed}</span><br /> 
                                            <strong>Age</strong>: <span class="pet-age">{pet.age}</span><br /> 
                                            <strong>Location</strong>: <span class="pet-location">{pet.location}</span><br /><br /> 
                                            <strong>Pet Price</strong>: <span class="pet-location">{window.web3.utils.fromWei(pet.price.toString(), 'ether') + " ETH"}</span><br /><br /> 
                                            <strong>Pet Owner</strong>: <span class="pet-owner">{pet.ownerId}</span><br /><br /> 
                                            <strong>Pet Status</strong>: <span class="pet-status">{JSON.parse(pet.status) ? 'Available' : 'Sold'}</span><br /><br /> 
                                            <strong> 
                                                {  
                                                    JSON.parse(pet.status) ? 
                                                        <button className="buyButton" 
                                                                name={pet.petId} 
                                                                value={pet.price} 
                                                                onClick={(event) => { 
                                                                    console.log("buy clicked") 
                                                                    this.props.purchasePet(event.target.name, event.target.value) 
                                                                }} 
                                                        >Buy</button> 
                                                    :<p>Sold</p>                           
                                                } 
                                            </strong> 
                                        </div> 
                                    </div> 
                                </div> 
                            </div> 
                        ) 
                    })} 
                </div> 
            </div> 
        ) 
    } 
} 

export default Main;
