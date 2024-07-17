const { Web3 } = require("web3");

// Loading the contract ABI and Bytecode (the results of a previous compilation step)
const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("build/contracts/CrowdFunding.json"));

async function main() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );

  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);

  // Obtain the balance of the account
  web3.eth.getBalance(process.env.SIGNER_PUBLIC_KEY, "latest", (err, wei) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(wei + " WEI");
    const balanceE = web3.utils.fromWei(wei, "ether");
    console.log(balanceE + " ETH");
  });
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas()
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });

  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);

  // Get the name of the crowdfunding campaign
  deployedContract.methods.getFundName().call((err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Fund Name:", result);
  });

  // Get the number of funds
  deployedContract.methods.getNoOfFunds().call((err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Number of Funds:", result);
  });

  // Add a new fund
  deployedContract.methods
    .addFunds(
      "Medical Aid",
      "medical_aid.jpg",
      web3.utils.toWei("10", "ether"),
      0,
      "Fundraising for medical expenses"
    )
    .estimateGas({ from: process.env.SIGNER_PUBLIC_KEY })
    .then(function (gasAmount) {
      console.log("Estimated Gas Amount:", gasAmount);

      deployedContract.methods
        .addFunds(
          "Medical Aid",
          "medical_aid.jpg",
          web3.utils.toWei("10", "ether"),
          0,
          "Fundraising for medical expenses"
        )
        .send({
          from: process.env.SIGNER_PUBLIC_KEY,
          gas: gasAmount
        })
        .then(function (receipt) {
          console.log("Transaction Receipt:", receipt);

          // Get the number of funds after adding a new one
          deployedContract.methods.getNoOfFunds().call((err, result) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("Number of Funds after adding a new one:", result);
          });
        });
    })
    .catch((err) => {
      console.error(err);
    });
}

require("dotenv").config();
main();

