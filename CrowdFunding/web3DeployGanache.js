const Web3 = require("web3");
const fs = require("fs");
require("dotenv").config();

// Load the ABI and Bytecode of the contract
const { abi, bytecode } = JSON.parse(fs.readFileSync("build/contracts/CrowdFunding.json"));

async function main() {
  // Setup web3 instance connected to Ganache
  const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  try {
    // Get accounts from Ganache
    const accounts = await web3.eth.getAccounts();
    const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);

    console.log('Signer Address:', signer.address);

    // Check the balance of the signer account
    const balanceWei = await web3.eth.getBalance(signer.address);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    console.log(`Signer balance: ${balanceEth} ETH`);

    // Add the signer account to the wallet
    web3.eth.accounts.wallet.add(signer);

    // Create contract instance and set the bytecode
    const contract = new web3.eth.Contract(abi);
    contract.options.data = bytecode;

    // Estimate gas for deployment
    const deployTx = contract.deploy();
    const gasEstimate = await deployTx.estimateGas();
    console.log(`Estimated Gas for deployment: ${gasEstimate}`);

    // Deploy the contract
    const crowdFundingContract = await deployTx.send({
      from: signer.address,
      gas: gasEstimate,
    });

    console.log(`Contract deployed at ${crowdFundingContract.options.address}`);

    // Get the name of the crowdfunding campaign
    const fundName = await crowdFundingContract.methods.getFundName().call();
    console.log(`Fund Name: ${fundName}`);

    // Get the number of funds
    const noOfFunds = await crowdFundingContract.methods.getNoOfFunds().call();
    console.log(`Number of Funds: ${noOfFunds}`);

    // Estimate gas for adding a new fund
    const gasAmountEstimate = await crowdFundingContract.methods
      .addFunds(
        'Medical Aid',
        'medical_aid.jpg',
        web3.utils.toWei('10', 'ether'),
        0,
        'Fundraising for medical expenses'
      )
      .estimateGas({ from: accounts[0] }); // Use the first account from Ganache

    console.log('Gas Amount Estimate for adding funds:', gasAmountEstimate);

    // Add a new fund
    const receipt = await crowdFundingContract.methods
      .addFunds(
        'Medical Aid',
        'medical_aid.jpg',
        web3.utils.toWei('10', 'ether'),
        0,
        'Fundraising for medical expenses'
      )
      .send({
        from: accounts[0], // Use the first account from Ganache
        gas: gasAmountEstimate,
      });

    console.log('Transaction Receipt:', receipt);

    // Get the updated number of funds
    const updatedNoOfFunds = await crowdFundingContract.methods.getNoOfFunds().call();
    console.log('Updated Number of Funds:', updatedNoOfFunds);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
