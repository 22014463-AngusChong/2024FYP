const {Web3} = require("web3");

// Loading the contract ABI and Bytecode// (the results of a previous compilation step)
const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("build/contracts/CrowdFunding.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
    ),
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY,);
  // Obtain the balance of the account
  web3.eth.getBalance(process.env.SIGNER_PUBLIC_KEY, "latest",(err, wei) => {
    console.log(wei + "WEI")
    balanceE = web3.utils.fromWei(wei, 'Ether');
    console.log(balanceE + "ETH");
  })
  web3.eth.accounts.wallet.add(signer);
  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  deployedContract.methods.getCompanyName().call((err, result) => {    
      console.log("Company Name " + result) })
  deployedContract.methods.getNoOfFunds().call((err, result) => { 
      console.log("No of funds " + result) })
  //console.log(result);*/
  deployedContract.methods.addFunds('Mona', "Davinci", "2", "mona.jpeg", 
  "15", web3.utils.toWei('0.000001', 'ether')).estimateGas(
    {from: process.env.SIGNER_PUBLIC_KEY}).then(function(gasAmount){
      console.log("gas Amount" + gasAmount);
  });
 
  deployedContract.methods.addFunds('Mona', "Davinci","2","mona.jpeg",
  "15").send({ 
        from: process.env.SIGNER_PUBLIC_KEY,
        gas: 240000}).then(function(receipt){
          console.log(receipt)
  });

  deployedContract.methods.getNoOfFunds().call((err, result) => { console.log("No of funds " + result) })

  //Get the company name  
  const companyName = await deployedContract.methods.getCompanyName().call(); 
  console.log("Company Name: " + companyName);

  //Get number of CrowdFunding
  const fundsNo = await deployedContract.methods.getNoOfFunds().call();
  console.log("Number of funds: " + fundsNo);
}

require("dotenv").config();
main();
