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
        fundsCount=0;
        currentFundStatus = FundingStatus.Ongoing;
        webName = "CrowdFunding";
        owner = msg.sender;
    }

    //function that sets the reading status to “Sold”.  
    function setFundSold() public {
        currentFundStatus = FundingStatus.Ended;
    }
        
    function getFundName() public view returns(string memory){
        return webName;
    }

    //a function to retrieve the current availability of the fund.
    function getFundStatus() public view returns(FundingStatus) {
        return currentFundStatus;
    }

    // Declaring a structure fundDetails
    struct FundDetails {
        uint fundId;
        string name;
        string picName;
        uint goal;
        uint donated;
        string desc;
        uint256[] donations;
        address payable ownerId;
        FundingStatus status;
    }

    // Declaring a structure ownerDetails
    struct ownerDetails {
        address ownerId;
        string firstName;
        string lastName;
        string mobileNo;
        string email;
    }

    struct donationinfo {
        address donor;
        uint amnt;
    }    

    mapping (uint => FundDetails) public listOfFunds;
    mapping (address => uint) public userDonations;
    donationinfo[] public donations;

    //create the event to add Fund
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

    // Write a function addFund with the relevant function parameters
    function addFunds(string memory _name, string memory _picName,
        uint _goal, uint _donated, string memory _desc) public {
        incrementFundCount();
        uint[] memory empDonations;
        listOfFunds[fundsCount] = FundDetails(fundsCount, _name, _picName, _goal, _donated, _desc, empDonations, payable(msg.sender), FundingStatus.Ongoing);
        //emit the event to addFund 
        emit FundCreated(fundsCount, _name, _picName, _goal, _donated, _desc, payable(msg.sender), FundingStatus.Ongoing);
    }

    function incrementFundCount() internal {
        fundsCount += 1;
    }

    // Write a function getNoOfFunds to obtain the fundsCount
    function getNoOfFunds() public view returns (uint) {
        return fundsCount;
    }

    // Create the event to purchase the Fund
    event FundDonated(
        uint id,
        string name,
        uint amnt,
        uint goal,
        uint donated,
        string desc,
        address payable owner,
        FundingStatus status
    );

    function donateFund(uint _id) public payable {
        FundDetails storage fundsInfo = listOfFunds[_id];
        address payable seller = fundsInfo.ownerId;
        require(fundsInfo.fundId > 0 && fundsInfo.fundId <= fundsCount, "Invalid fund ID");
        require(fundsInfo.status == FundingStatus.Ongoing, "Campaign reached goal");
        require(seller != msg.sender, "Seller cannot donate own fund");
        fundsInfo.donated += msg.value;
        fundsInfo.donations.push(msg.value);
        donations.push(donationinfo({
            donor: msg.sender,
            amnt: msg.value
        }));
        userDonations[msg.sender] += msg.value;
        payable(seller).transfer(msg.value);
        if (fundsInfo.donated >= fundsInfo.goal) {
            fundsInfo.status = FundingStatus.Ended;
        }
        emit FundDonated(fundsInfo.fundId, fundsInfo.name, msg.value, fundsInfo.goal, fundsInfo.donated, fundsInfo.desc, payable(msg.sender), fundsInfo.status);
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
