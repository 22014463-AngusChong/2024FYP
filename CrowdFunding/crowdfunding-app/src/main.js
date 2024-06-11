import React, { Component } from 'react'; 

class Main extends Component { 
    render() { 
        const { listOfFunds } = this.props; 
        const availableFundsCount = listOfFunds.reduce((count, fund) => { 
            return JSON.parse(fund.status) ? count + 1 : count; 
        }, 0); 
        const soldFundsCount = listOfFunds.length - availableFundsCount; 

        return ( 
            <div class="container"> 
                <h1>Funde's Fund Shop</h1> 
                <h2>Total Number of Funds Available: {availableFundsCount}</h2> 
                <h2>Total Number of Funds Sold: {soldFundsCount}</h2> 
                <h4>Account: {this.props.account}</h4> 
                 
                <hr /> 
                <br /> 
                <div id="fundsRow" class="row"> 
                    {listOfFunds.map((fund, key) => {   
                        return (                            
                            <div class="col-sm-6 col-md-4 col-lg-3"> 
                                <div key={key} id="fundTemplate"> 
                                    <div class="panel panel-default panel-fund"> 
                                        <div class="panel-heading"> 
                                            <h2>{fund.fundId}</h2> 
                                            <h3 class="panel-title">{fund.name}</h3> 
                                        </div> 
                                        <div class="panel-body"> 
                                            <img alt="140x140" width="200" data-src="holder.js/140x140"  
                                            class="img-rounded img-center" 
                                                src={fund.picName} data-holder-rendered="true" /> 
                                            <br /><br /> 
                                            <strong>Fund Price</strong>: <span class="fund-location">{window.web3.utils.fromWei(fund.price.toString(), 'ether') + " ETH"}</span><br /><br /> 
                                            <strong>Fund Owner</strong>: <span class="fund-owner">{fund.ownerId}</span><br /><br /> 
                                            <strong>Fund Owner</strong>: <span class="fund-owner">{fund.desc}</span><br /><br /> 
                                            <strong>Fund Status</strong>: <span class="fund-status">{JSON.parse(fund.status) ? 'Ongoing' : 'Ended'}</span><br /><br /> 
                                            <strong> 
                                                {  
                                                    JSON.parse(fund.status) ? 
                                                        <button className="buyButton" 
                                                                name={fund.fundId} 
                                                                value={fund.price} 
                                                                onClick={(event) => { 
                                                                    console.log("buy clicked") 
                                                                    this.props.purchaseFund(event.target.name, event.target.value) 
                                                                }} 
                                                        >Buy</button> 
                                                    :<p>Sold</p>                           
                                                } 
                                            </strong> 
                                        </div> 
                                    </div> 
                                </div> 
                            </div> 
                        ) 
                    })} 
                </div> 
            </div> 
        ) 
    } 
} 

export default Main;
