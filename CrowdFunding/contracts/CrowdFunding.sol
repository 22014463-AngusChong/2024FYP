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

    constructor() {
        fundsCount=0;
        currentFundStatus = FundingStatus.Ongoing;
        webName = "CrowdFunding";
        owner = msg.sender;
    }

    function setFundSold() public {
        currentFundStatus = FundingStatus.Ended;
    }
        
    function getFundName() public view returns(string memory){
        return webName;
    }

    function getFundStatus() public view returns(FundingStatus) {
        return currentFundStatus;
    }

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

    struct Donation {
        address donor;
        uint amount;
    }


    mapping(uint => FundDetails) public listOfFunds;
    mapping(uint => Donation[]) public fundDonations;
    mapping (address => uint) public userDonations;

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

    function addFunds(string memory _name, string memory _picName,
        uint _goal, uint _donated, string memory _desc) public {
        incrementFundCount();
        uint[] memory empDonations;
        listOfFunds[fundsCount] = FundDetails(fundsCount, _name, _picName, _goal, _donated, _desc, empDonations, payable(msg.sender), FundingStatus.Ongoing);
        emit FundCreated(fundsCount, _name, _picName, _goal, _donated, _desc, payable(msg.sender), FundingStatus.Ongoing);
    }

    function incrementFundCount() internal {
        fundsCount += 1;
    }

    function getNoOfFunds() public view returns (uint) {
        return fundsCount;
    }

   
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
        fundDonations[_id].push(Donation({
            donor: msg.sender,
            amount: msg.value
        }));
        userDonations[msg.sender] += msg.value;
        payable(seller).transfer(msg.value);
        if (fundsInfo.donated >= fundsInfo.goal) {
            fundsInfo.status = FundingStatus.Ended;
        }
        emit FundDonated(fundsInfo.fundId, fundsInfo.name, msg.value, fundsInfo.goal, fundsInfo.donated, fundsInfo.desc, payable(msg.sender), fundsInfo.status);
    }

    function getDonationHistory(uint _id) public view returns (Donation[] memory) {
        require(_id <= fundsCount, "Invalid fund ID");
        return fundDonations[_id];
    }

    function getUserRating(address _user) public view returns (uint) {
        uint totalDonated = userDonations[_user];

        if (totalDonated >= 10 ether) return 5; // Platinum
        if (totalDonated >= 5 ether) return 4;  // Gold
        if (totalDonated >= 1 ether) return 3;  // Silver
        if (totalDonated >= 0.5 ether) return 2; // Bronze
        return 1; // classic 
    }

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
