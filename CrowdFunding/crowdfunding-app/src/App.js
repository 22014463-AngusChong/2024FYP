import React, { Component } from 'react';
import NavBar from './NavBar';
import Footer from './footer';
import Web3 from 'web3';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import Layout from "./pages/Layout";
import ContactUs from "./pages/ContactUs";
import CrowdFunding from './build/CrowdFunding.json';
import Main from './Main';
import AddFunds from './pages/AddFunds';
import MemberClub from './pages/MemberClub';
import Campaigns from './pages/Campaigns';
import MemberClub from './pages/MemberClub';
import Campaigns from './pages/Campaigns';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = CrowdFunding.networks[networkId];

    if (networkData) {
      const contractInfo = new web3.eth.Contract(CrowdFunding.abi, networkData.address);
      this.setState({ contractInfo });

      const fundsCount = await contractInfo.methods.getNoOfFunds().call();
      this.setState({ fundsCount });
      this.setState({ loading: false });

      for (var i = 1; i <= fundsCount; i++) {
        const artInfo = await contractInfo.methods.listOfFunds(i).call();
        this.setState({
          listOfFunds: [...this.state.listOfFunds, artInfo],
        });
        console.log(this.state.listOfFunds);
      }

    } else {
      window.alert('CrowdFunding contract not deployed to detected network.');
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      fundsCount: 0,
      loading: true,
      listOfFunds: [],
    };
    this.addFunds = this.addFunds.bind(this);
    this.donateFund = this.donateFund.bind(this);
    this.getDonationHistory = this.getDonationHistory.bind(this);
  }

  async addFunds(name, picName, goal, donated, desc, navigate) {
    const balance = window.web3.eth.getBalance(this.state.account);
    console.log(balance);
    const count = await this.state.contractInfo.methods.getNoOfFunds().call();
    console.log(count.toString());
    const output = await this.state.contractInfo.methods.addFunds(name, picName,
      goal, donated, desc).estimateGas({ from: this.state.account });
    const data = await this.state.contractInfo.methods.addFunds(name, picName,
      goal, donated, desc).send({ from: this.state.account, gas: "1000000" });
    console.log(output);
    console.log(data);

    
    const newCampaignId = await this.state.contractInfo.methods.getNoOfFunds().call();
    const newCampaign = await this.state.contractInfo.methods.listOfFunds(newCampaignId).call(); 
    this.setState({
      listOfFunds: [...this.state.listOfFunds, newCampaign],
      fundsCount: newCampaignId
    });

    navigate("/");  
  }

  async donateFund(id, amount) {
    const output = await this.state.contractInfo.methods.donateFund(id).send({ from: this.state.account, value: amount })
      .once('receipt', (receipt) => {
        console.log(receipt);
      });
    console.log(output);
    window.location.assign("/");
  }

  async getDonationHistory(id) {
    const donations = await this.state.contractInfo.methods.getDonationHistory(id).call();
    console.log(donations);
    return donations;
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
                <Route path="/" element={<Layout />} />
                <Route path="AboutUs" element={<AboutUs />} />
                <Route path="ContactUs" element={<ContactUs />} />

                <Route index element={<Main
                  fundsCount={this.state.fundsCount}
                  account={this.state.account}
                  listOfFunds={this.state.listOfFunds}
                  donateFund={this.donateFund}
                  getDonationHistory={this.getDonationHistory} />} />

                <Route path="AddFunds" element={<AddFundsWrapper
                  fundsCount={this.state.fundsCount}
                  account={this.state.account}
                  addFunds={this.addFunds} />} />

                <Route path="MemberClub" element={<MemberClub
                  account={this.state.account}
                  contract={this.state.contractInfo} />} />

                <Route path="Campaigns" element={<Campaigns
                  account={this.state.account}
                  contract={this.state.contractInfo} />} />
              </Routes>
            </BrowserRouter>
        }
        <Footer />
      </div>
    );
  }
}

const AddFundsWrapper = (props) => {
  const navigate = useNavigate();
  return <AddFunds {...props} navigate={navigate} />;
}

export default App;
