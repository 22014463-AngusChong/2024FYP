import React, { Component } from 'react';
import NavBar from './NavBar';
import Footer from './footer'
import Web3 from 'web3';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Layout from "./pages/Layout";
import AddFund from "./pages/AddFunds";
import CrowdFunding from './build/CrowdFunding.json'; 
//import FundInfo from './build/FundInfo.json';
import Main from './Main'

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()    
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
    const networkData = CrowdFunding.networks[networkId]
    if (networkData) {
        //reads the abi data from CrowdFundingContract 
      const contractInfo = new web3.eth.Contract(CrowdFunding.abi, networkData.address)
      this.setState({ contractInfo })
      console.log(contractInfo)
      // calls the function getNoOfFunds from the fund contract deployed
      const fundCount = await contractInfo.methods.getNoOfFunds().call()
      console.log(fundCount.toString());
      //assigns the fundCount variable declared in the constructor
      this.setState({ fundCount });
      // reading the fundInfo.json file and assign the data to listOfFunds array
      /*for (var i = 1; i <= FundInfo.length; i++) {        
        this.state.listOfFunds.push(FundInfo[i]);
        console.log(this.state.listOfFunds);
      }*/
      web3.eth.getBalance(accounts[0]).then(result => console.log(result));
      // Load products       // reads fund information from the smart contract
      for (var i = 1; i <= fundCount; i++) {
        const fundInfo = await contractInfo.methods.listOfFunds(i).call()
        this.setState({
          listOfFunds: [...this.state.listOfFunds, fundInfo]
        })
        console.log(this.state.listOfFunds);
      }
      this.setState({ loading: false })
    } else {
      window.alert('Fund contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      fundCount: 0,
      loading: true,   
      listOfFunds: [],        
    }
    this.addFund = this.addFund.bind(this)
    this.purchaseFund = this.purchaseFund.bind(this)
  }

  async addFund(name, picName, age, breed, location, price) {      
      const balance = window.web3.eth.getBalance(this.state.account);
      console.log(balance)
      const count = await this.state.contractInfo.methods.getNoOfFunds().call()
      console.log(count.toString());
      const output = await this.state.contractInfo.methods.addFund(name, picName, 
                age, breed, location, price).estimateGas({from: this.state.account});
      const data = await this.state.contractInfo.methods.addFund(name, picName, 
              age, breed, location, price).send({from: this.state.account, gas:"1000000"})
      console.log(output)
      console.log(data)
      window.open("/");
  }
  async purchaseFund(id, price) {
    const output = await this.state.contractInfo.methods.purchaseFund(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      console.log(receipt);
    })    
    console.log(output)
    window.location.assign("/")
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
                    fundCount={this.state.fundCount}
                    account={this.state.account}
                    listOfFunds={this.state.listOfFunds}
                    purchaseFund = {this.purchaseFund} />} />

                <Route path="AddFund" element={<AddFund
                    fundCount={this.state.fundCount}
                    account={this.state.account}
                    addFund={this.addFund} />} />
              </Routes>
            </BrowserRouter>
        }       
        <Footer />
      </div>
    );
  }
}

export default App;
