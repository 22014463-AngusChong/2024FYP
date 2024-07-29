const CrowdFunding = artifacts.require('./CrowdFunding.sol'); // Import smart contract 

contract('CrowdFunding', (accounts) => { 
    let crowdFundingContract; 
    const [account, creator, donor] = accounts; // Destructure accounts array 

    console.log("account " + account); 
    console.log("creator " + creator); 
    console.log("donor " + donor); 

    before(async () => { 
        crowdFundingContract = await CrowdFunding.deployed(); 
    }); // Runs before test 

    describe("Deployment", async () => { 
        it("Verify the fund name", async () => { 
            const name = await crowdFundingContract.getFundName(); 
            assert.equal(name, "CrowdFunding"); 
        }); 

        it("Verify the fund count", async () => { 
            const fundCount = await crowdFundingContract.getNoOfFunds(); 
            assert.equal(fundCount, 0); 
        }); 
    }); 

    describe('adding funds', async () => { 
        let result, fundCount; 
        before(async () => { 
            result = await crowdFundingContract.addFunds( 
                'Medical Aid', 
                'medical_aid.jpg', 
                web3.utils.toWei('10', 'ether'), 
                0, // Initial donation
                'Fundraising for medical expenses', 
                { from: creator } 
            ); 
            fundCount = await crowdFundingContract.getNoOfFunds(); 
            console.log(fundCount); 
        }); 

        it('verifying fund name', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.name, "Medical Aid", "fund name is correct"); 
        }); 

        it('verifying fund picName', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.picName, "medical_aid.jpg", "fund picName is correct"); 
        }); 

        it('verifying fund goal', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.goal.toString(), web3.utils.toWei('10', 'ether'), "fund goal is correct"); 
        }); 

        it('verifying fund description', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.desc, "Fundraising for medical expenses", "fund description is correct"); 
        }); 

        it('verifying fund ownerId', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.ownerId, creator, "fund ownerId is correct"); 
        }); 

        it('verifying fund status', async () => { 
            const event = result.logs[0].args; 
            assert.equal(event.status, 1, "fund status is correct"); 
        }); 
    }); 

    describe('donating to funds', async () => {
        let event;
        let fundDonation = 5;

        it('verifying creator & donor balance', async () => {
            donorBalance = await web3.eth.getBalance(donor);
            donorBalanceEth = web3.utils.fromWei(donorBalance, 'ether');
            console.log("donor balance " + donorBalanceEth);

            creatorBalance = await web3.eth.getBalance(creator);
            creatorBalanceEth = web3.utils.fromWei(creatorBalance, 'ether');
            console.log("creator balance " + creatorBalanceEth);

            assert(donorBalance > web3.utils.toWei(fundDonation.toString(), 'ether'), "Donor balance should be greater than donation amount");
        });

        it('donate to fund and check if fund goal is updated', async () => {
            const fundCount = await crowdFundingContract.getNoOfFunds();
            fundDonationString = fundDonation.toString();
            result = await crowdFundingContract.donateFund(fundCount, 
                { from: donor, value: web3.utils.toWei(fundDonationString, 'Ether') });
            event = result.logs[0].args;
            console.log(event);
            
            assert.equal(event.donated.toString(), web3.utils.toWei(fundDonationString, 'Ether'), 'donation amount is correct');
        });

        it('verify fund status as ongoing', async () => {
            const fundDetails = await crowdFundingContract.listOfFunds(1);
            assert.equal(fundDetails.status, 1, 'fund status should be ongoing');
        });

        it('verify creator balance after donation', async () => {
            let currentCreatorBal = await web3.eth.getBalance(creator);
            currentCreatorBalEth = web3.utils.fromWei(currentCreatorBal, 'ether');
            currentCreatorBalEthP = parseInt(currentCreatorBalEth, 10);
            console.log("currentCreatorBalEthP = " + currentCreatorBalEthP);
            let creatorBalanceEthP = parseInt(creatorBalanceEth, 10);
            let expectedCreatorBal = creatorBalanceEthP + fundDonation;
            console.log("creatorBalanceEthP = " + creatorBalanceEthP);
            console.log("expectedCreatorBal = " + expectedCreatorBal);
            
            assert.equal(currentCreatorBalEthP.toString(), expectedCreatorBal.toString());
        });

        it('verify donor balance after donation', async () => {            
            let currentDonorBal = await web3.eth.getBalance(donor);            
            currentDonorBalEth = web3.utils.fromWei(currentDonorBal, 'ether');            
            currentDonorBalEthP = parseInt(currentDonorBalEth, 10);            
            console.log("currentDonorBalEthP = " + currentDonorBalEthP);           
            let donorBalanceEthP = parseInt(donorBalanceEth, 10);          
            let expectedDonorBal = donorBalanceEthP - fundDonation;
            console.log("donorBalanceEthP = " + donorBalanceEthP);        
            console.log("expectedDonorBal = " + expectedDonorBal);        
            assert.equal(currentDonorBalEthP.toString(), expectedDonorBal.toString());        
        });
    });
});
