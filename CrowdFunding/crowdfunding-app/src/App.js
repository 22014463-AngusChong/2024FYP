import React, { Component } from 'react';
import NavBar from './NavBar';
import Footer from './footer'
import Web3 from 'web3';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Layout from "./pages/Layout";
import AddPet from "./pages/AddFunds";
import PetContract from './build/PetContract.json';
//import PetInfo from './build/PetInfo.json';
import Main from './Main'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()    
  }

  async purchasePet(id, price) {
    const output = await this.state.contractInfo.methods.purchasePet(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      console.log(receipt);
    })    
    console.log(output)
    window.location.assign("/")
  }

  async loadWeb3() {
    //loads the connection to the blockchain (ganache )
    //window.web3 = new Web3("http://127.0.0.1:7545");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
   }
   else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
   }
   else {
       window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
   } 
  }


  async loadBlockchainData() {
    const web3 = window.web3
    // Load account from the network /blockchain/ganache
    //loads 10 accounts from ganache 
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0]);
    // set the state of the variable account declared in constructor.
    this.setState({ account: accounts[0] })
    // gets the network id from the web3 connection to ganache
    //ganache 5777
    const networkId = await web3.eth.net.getId()
    console.log(networkId)
    //reads the network data migrated into the gananche
    const networkData = PetContract.networks[networkId]
    if (networkData) {
        //reads the abi data from Petcontract 
      const contractInfo = new web3.eth.Contract(PetContract.abi, networkData.address)
      this.setState({ contractInfo })
      console.log(contractInfo)
      // calls the function getNoOfPets from the pet contract deployed
      const petCount = await contractInfo.methods.getNoOfPets().call()
      console.log(petCount.toString());
      //assigns the petCount variable declared in the constructor
      this.setState({ petCount });
      // reading the petInfo.json file and assign the data to listOfPets array
      /*for (var i = 1; i <= PetInfo.length; i++) {        
        this.state.listOfPets.push(PetInfo[i]);
        console.log(this.state.listOfPets);
      }*/
      web3.eth.getBalance(accounts[0]).then(result => console.log(result));
      // Load products       // reads pet information from the smart contract
      for (var i = 1; i <= petCount; i++) {
        const petInfo = await contractInfo.methods.listOfPets(i).call()
        this.setState({
          listOfPets: [...this.state.listOfPets, petInfo]
        })
        console.log(this.state.listOfPets);
      }
      this.setState({ loading: false })
    } else {
      window.alert('Pet contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      petCount: 0,
      loading: true,   
      listOfPets: [],        
    }
    this.addPet = this.addPet.bind(this)
    this.purchasePet = this.purchasePet.bind(this)
  }

  async addPet(name, picName, age, breed, location, price) {      
      const balance = window.web3.eth.getBalance(this.state.account);
      console.log(balance)
      const count = await this.state.contractInfo.methods.getNoOfPets().call()
      console.log(count.toString());
      const output = await this.state.contractInfo.methods.addPet(name, picName, 
                age, breed, location, price).estimateGas({from: this.state.account});
      const data = await this.state.contractInfo.methods.addPet(name, picName, 
              age, breed, location, price).send({from: this.state.account, gas:"1000000"})
      console.log(output)
      console.log(data)
      window.open("/");
  }
   
  render() {
    return (
      <div>
        <NavBar account={this.state.account} />
        {
          this.state.loading
              ? <div id="loader" className="text-center">
                <p className="text-center">Loading...</p></div>
          :                    
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}/>
                <Route path="AboutUs" element={<AboutUs />} />

                <Route index element={<Main
                    petCount={this.state.petCount}
                    account={this.state.account}
                    listOfPets={this.state.listOfPets}
                    purchasePet = {this.purchasePet} />} />

                <Route path="AddPet" element={<AddPet
                    petCount={this.state.petCount}
                    account={this.state.account}
                    addPet={this.addPet} />} />
              </Routes>
            </BrowserRouter>
        }       
        <Footer />
      </div>
    );
  }
}

export default App;
