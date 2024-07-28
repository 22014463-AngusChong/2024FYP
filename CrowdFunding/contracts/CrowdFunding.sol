// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CrowdFunding {
    enum FundingStatus {Ended, Ongoing}
    
    string webName;
    uint fundsCount;
    FundingStatus currentFundStatus;
    address public owner;
    uint public fundsEnded;
    uint public fundsOngoing;

    // Constructor code is only run when the contract is created
    constructor() {
        fundsCount = 0;
        currentFundStatus = FundingStatus.Ongoing;
        webName = "CrowdFunding";
        owner = msg.sender;
    }

    // Function that sets the reading status to “Sold”.
    function setFundSold() public {
        currentFundStatus = FundingStatus.Ended;
    }
        
    function getFundName() public view returns(string memory) {
        return webName;
    }

    // Function to retrieve the current availability of the fund.
    function getFundStatus() public view returns(FundingStatus) {
        return currentFundStatus;
    }

    // Declaring a structure for donations
    struct Donation {
        address donor;
        uint amount;
    }

    // Declaring a structure for fund details
    struct FundDetails {
        uint fundId;
        string name;
        string picName;
        uint goal;
        uint donated;
        string desc;
        address payable ownerId;
        FundingStatus status;
    }


    mapping(uint => FundDetails) public listOfFunds;
    mapping(uint => Donation[]) public fundDonations;
    mapping (address => uint) public userDonations;

    // Event to add a fund
    event FundCreated(
        uint fundId,
        string name,
        string picName,
        uint goal,
        uint donated,
        string desc,
        address payable ownerId,
        FundingStatus status
    );

    // Function to add a fund with the relevant parameters
    function addFunds(
        string memory _name,
        string memory _picName,
        uint _goal,
        uint _donated,
        string memory _desc
    ) public {
        incrementFundCount();
        listOfFunds[fundsCount] = FundDetails(
            fundsCount,
            _name,
            _picName,
            _goal,
            _donated,
            _desc,
            payable(msg.sender),
            FundingStatus.Ongoing
        );
        // Emit the event to add a fund
        emit FundCreated(fundsCount, _name, _picName, _goal, _donated, _desc, payable(msg.sender), FundingStatus.Ongoing);
    }

    function incrementFundCount() internal {
        fundsCount += 1;
    }

    // Function to get the number of funds
    function getNoOfFunds() public view returns (uint) {
        return fundsCount;
    }

    // Event to donate to a fund
    event FundDonated(
        uint id,
        string name,
        uint amount,
        uint goal,
        uint donated,
        string desc,
        address payable owner,
        FundingStatus status
    );

    // Function to donate to a fund
    function donateFund(uint _id) public payable {
        FundDetails storage fundsInfo = listOfFunds[_id];
        address payable seller = fundsInfo.ownerId;
        require(fundsInfo.fundId > 0 && fundsInfo.fundId <= fundsCount, "Invalid fund ID");
        require(fundsInfo.status == FundingStatus.Ongoing, "Campaign has ended");
        require(seller != msg.sender, "Seller cannot donate to own fund");
        fundsInfo.donated += msg.value;
        fundDonations[_id].push(Donation({
            donor: msg.sender,
            amount: msg.value
        }));
        payable(seller).transfer(msg.value);
        if (fundsInfo.donated >= fundsInfo.goal) {
            fundsInfo.status = FundingStatus.Ended;
        }
        emit FundDonated(fundsInfo.fundId, fundsInfo.name, msg.value, fundsInfo.goal, fundsInfo.donated, fundsInfo.desc, payable(seller), fundsInfo.status);
    }

    // Function to retrieve donation history for a specific fund
    function getDonationHistory(uint _id) public view returns (Donation[] memory) {
        require(_id <= fundsCount, "Invalid fund ID");
        return fundDonations[_id];
    }

    // New function to get user rating based on total donations
    function getUserRating(address _user) public view returns (uint) {
        uint totalDonated = userDonations[_user];

        if (totalDonated >= 10 ether) return 5; // Platinum
        if (totalDonated >= 5 ether) return 4;  // Gold
        if (totalDonated >= 1 ether) return 3;  // Silver
        if (totalDonated >= 0.5 ether) return 2; // Bronze
        return 1; // classic 
    }

    // New function to get campaign star rating based on progress
    function getCampaignStars(uint _campaignId) public view returns (uint) {
        FundDetails storage campaign = listOfFunds[_campaignId];
        uint percentage = (campaign.donated * 100) / campaign.goal;

        if (percentage >= 100) return 5;
        if (percentage >= 75) return 4;
        if (percentage >= 50) return 3;
        if (percentage >= 25) return 2;
        return 1;
    }
}
