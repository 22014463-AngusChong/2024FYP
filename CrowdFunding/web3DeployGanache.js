const { Web3 } = require("web3");
const fs = require("fs");

const { abi, bytecode } = JSON.parse(fs.readFileSync("build/contracts/CrowdFunding.json"));

async function main() {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Assuming Ganache runs on the default URL

  try {
    const accounts = await web3.eth.getAccounts();
    const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);

    console.log('Signer Address:', signer.address);

    const balanceWei = await web3.eth.getBalance(signer.address);
    console.log(`${balanceWei} WEI`);

    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    console.log(`${balanceEth} ETH`);

    web3.eth.accounts.wallet.add(signer);

    const contract = new web3.eth.Contract(abi);
    contract.options.data = bytecode;

    const deployTx = contract.deploy();
    const gasEstimate = await deployTx.estimateGas();

    const crowdFundingContract = await deployTx.send({
      from: signer.address,
      gas: gasEstimate,
    });

    console.log(`Contract deployed at ${crowdFundingContract.options.address}`);

    const fundName = await crowdFundingContract.methods.getFundName().call();
    console.log(`Fund Name: ${fundName}`);

    const noOfFunds = await crowdFundingContract.methods.getNoOfFunds().call();
    console.log(`Number of Funds: ${noOfFunds}`);

    const gasAmountEstimate = await crowdFundingContract.methods
      .addFunds(
        'Medical Aid',
        'medical_aid.jpg',
        web3.utils.toWei('10', 'ether'),
        0,
        'Fundraising for medical expenses'
      )
      .estimateGas({ from: accounts[0] }); // Use the first account from Ganache

    console.log('Gas Amount Estimate:', gasAmountEstimate);

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
        gas: 240000,
      });

    console.log('Transaction Receipt:', receipt);

    const updatedNoOfFunds = await crowdFundingContract.methods.getNoOfFunds().call();
    console.log('Updated Number of Funds:', updatedNoOfFunds);
  } catch (error) {
    console.error('Error:', error);
  }
}

require('dotenv').config();
main();
