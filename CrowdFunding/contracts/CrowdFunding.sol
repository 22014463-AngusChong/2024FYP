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
}
