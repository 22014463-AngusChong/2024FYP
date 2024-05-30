const { Web3 } = require("web3");
const fs = require("fs");

const { abi, bytecode } = JSON.parse(fs.readFileSync("build/contracts/CrowdFunding.json"));

async function main() {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); // Assuming Ganache runs on the default URL

  try {
    const accounts = await web3.eth.getAccounts();
    const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY,);

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

    const CrowdFunding = await deployTx.send({
      from: signer.address,
      gas: gasEstimate,
    });

    console.log(`Contract deployed at ${CrowdFunding.options.address}`);

    const companyName = await CrowdFunding.methods.getCompanyName().call();
    console.log(`Company Name: ${companyName}`);

    const noOfArt = await CrowdFunding.methods.getNoOfArt().call();
    console.log(`No of CrowdFunding: ${noOfArt}`);

    const gasAmountEstimate = await CrowdFunding.methods
      .addArt(
        'Mona', "Davinci", "2", "mona.jpeg",
        "15",
        web3.utils.toWei('1', 'ether')
      )
      .estimateGas({ from: accounts[0] }); // Use the first account from Ganache

    console.log('Gas Amount Estimate:', gasAmountEstimate);

    const receipt = await CrowdFunding.methods
      .addArt(
        'Mona', "Davinci", "2", "mona.jpeg",
        "15",
        web3.utils.toWei('1', 'ether')
      )
      .send({
        from: accounts[0], // Use the first account from Ganache
        gas: 240000,
      });

    console.log('Transaction Receipt:', receipt);

    const updatedNoOfArt = await CrowdFunding.methods.getNoOfArt().call();
    console.log('Updated No of CrowdFunding:', updatedNoOfArt);
  } catch (error) {
    console.error('Error:', error);
  }
}

require('dotenv').config();
main();
