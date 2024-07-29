const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load the ABI and Bytecode of the contract
const { abi, bytecode } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "build/contracts/CrowdFunding.json"))
);

async function main() {
  // Setup web3 instance connected to Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );

  // Create account from private key and add to wallet
  const signer = web3.eth.accounts.privateKeyToAccount(process.env.SIGNER_PRIVATE_KEY);
  web3.eth.accounts.wallet.add(signer);

  // Check the signer's balance
  const balanceWei = await web3.eth.getBalance(signer.address);
  const balanceEth = web3.utils.fromWei(balanceWei, "ether");
  console.log(`Signer balance: ${balanceEth} ETH`);

  // Deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: await deployTx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction...`);
      console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });

  // Contract deployed!
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
  try {
    const gasEstimate = await deployedContract.methods
      .addFunds(
        "Medical Aid",
        "medical_aid.jpg",
        web3.utils.toWei("10", "ether"),
        0,
        "Fundraising for medical expenses"
      )
      .estimateGas({ from: signer.address });

    console.log("Estimated Gas Amount:", gasEstimate);

    const receipt = await deployedContract.methods
      .addFunds(
        "Medical Aid",
        "medical_aid.jpg",
        web3.utils.toWei("10", "ether"),
        0,
        "Fundraising for medical expenses"
      )
      .send({
        from: signer.address,
        gas: gasEstimate,
      });

    console.log("Transaction Receipt:", receipt);

    // Get the number of funds after adding a new one
    deployedContract.methods.getNoOfFunds().call((err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Number of Funds after adding a new one:", result);
    });
  } catch (error) {
    console.error("Error in adding funds:", error);
  }
}

main().catch((err) => {
  console.error("Error in script execution:", err);
});
