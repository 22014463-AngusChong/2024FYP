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
        uint price;
        uint goal;
        uint donated;
        string desc;
        address payable ownerId;
        FundingStatus status;
   }

    // Declaring a structure ownerDetails
   struct  ownerDetails {
        address ownerId;
        string firstName;
        string lastName;
        string mobileNo;
        string email;
    }    

    //FundDetails[] public listOfFunds;
    mapping (uint => FundDetails) public listOfFunds;

    //create the event to add Fund
    event FundCreated(
        uint fundId,
        string name,
        string picName,
        uint price,
        uint goal,
        uint donated,
        string desc,
        address payable ownerId,
        FundingStatus status
    );

    //Write a function addFund with the relevant function parameters
    function addFunds( string memory _name, string memory _picName,
        uint _price, uint _goal, uint _donated, string memory _desc) public {
        incrementFundCount();
        listOfFunds[fundsCount] = FundDetails(fundsCount, _name, _picName, _price, _goal, _donated, _desc, payable(msg.sender), FundingStatus.Ongoing);
        //emit the event to addFund 
        emit FundCreated(fundsCount, _name, _picName, _price, _goal, _donated, _desc, payable(msg.sender), FundingStatus.Ongoing);
    }

    function incrementFundCount() internal {
        fundsCount += 1;
    }
    //Write a function getNoOfFunds to obtain the fundsCount
    function getNoOfFunds() public view returns (uint) {
        return fundsCount;
    }

    //create the event to purchase the Fund
    event FundPurchased(
        uint id,
        string name,
        uint price,
        uint goal,
        uint donated,
        string desc,
        address payable owner,
        FundingStatus status
    );

    //add a function to purchase fund with the fund id
    function purchaseFund(uint _id) public payable {
        // Fetch the product
        FundDetails memory fundsInfo = listOfFunds[_id];
        // Fetch the owner
        address payable seller = fundsInfo.ownerId;
        // Make sure the product has a valid id
        require(fundsInfo.fundId > 0 && fundsInfo.fundId <= fundsCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= fundsInfo.price);
        // Require that the product has not been purchased already
        require(fundsInfo.status == FundingStatus.Ongoing);
        // Require that the buyer is not the seller
        require(seller != msg.sender);
        // Update the product
        listOfFunds[_id] = fundsInfo;
        // Pay the seller by sending them Ether
        payable(seller).transfer(msg.value);
        fundsInfo.donated+=msg.value;
        // Trigger an event
        if (fundsInfo.donated == fundsInfo.goal) {
            emit FundPurchased(fundsCount, fundsInfo.name, fundsInfo.price, fundsInfo.goal, fundsInfo.donated, fundsInfo.desc, payable(msg.sender), FundingStatus.Ended);
        }
        else {
            emit FundPurchased(fundsCount, fundsInfo.name, fundsInfo.price, fundsInfo.goal, fundsInfo.donated, fundsInfo.desc, payable(msg.sender), FundingStatus.Ongoing);
        }
    }

}
