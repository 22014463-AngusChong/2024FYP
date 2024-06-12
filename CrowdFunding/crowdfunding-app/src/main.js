import React, { Component } from 'react'; 

class Main extends Component { 
    render() { 
        const { listOfFunds } = this.props; 
        const availableFundsCount = listOfFunds.reduce((count, fund) => { 
            return JSON.parse(fund.status) ? count + 1 : count; 
        }, 0); 
        const soldFundsCount = listOfFunds.length - availableFundsCount; 

        return ( 
            <div className="container text-center"> 
                <h1 className="mt-4">Decentralized Crowdfunding Platform on the Blockchain</h1> 
                <h2>Total Number of Campaigns Available: {availableFundsCount}</h2> 
                <h2>Total Number of Campaigns Sold: {soldFundsCount}</h2> 
                <h4>Account: {this.props.account}</h4> 
                 
                <hr /> 
                <br /> 
                <div id="fundsRow" className="row"> 
                    {listOfFunds.map((fund, key) => {   
                        return (                                    
                            <div key={key} className="col-sm-6 col-md-4 col-lg-3 mb-4"> 
                                <div className="card h-100"> 
                                    <div className="card-header"> 
                                        <h2>{fund.fundId}</h2> 
                                        <h3 className="panel-title">{fund.name}</h3> 
                                    </div> 
                                    <div className="card-body"> 
                                        <img alt="140x140" width="200" className="img-fluid img-center" src={fund.picName} /> 
                                        <br /><br /> 
                                        <strong>Fund Price</strong>: <span className="fund-location">{window.web3.utils.fromWei(fund.price.toString(), 'ether') + " ETH"}</span><br /><br /> 
                                        <strong>Campaign Owner</strong>: <span className="fund-owner">{fund.ownerId}</span><br /><br /> 
                                        <strong>Campaign Description</strong>: <span className="fund-owner">{fund.desc}</span><br /><br /> 
                                        <strong>Campaign Status</strong>: <span className="fund-status">{JSON.parse(fund.status) ? 'Ongoing' : 'Ended'}</span><br /><br /> 
                                        <strong> 
                                            {  
                                                JSON.parse(fund.status) ? 
                                                    <button className="btn btn-primary buyButton" 
                                                            name={fund.fundId} 
                                                            value={fund.price} 
                                                            onClick={(event) => { 
                                                                console.log("buy clicked") 
                                                                this.props.purchaseFund(event.target.name, event.target.value) 
                                                            }} 
                                                    >Buy</button> 
                                                : <p>Sold</p>                                       
                                            } 
                                        </strong> 
                                    </div> 
                                </div> 
                            </div> 
                        ) 
                    })} 
                </div> 
                <style jsx>{`
                    .container {
                        margin-top: 20px;
                    }
                    h1, h2, h4 {
                        margin-bottom: 20px;
                    }
                    .card {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .card-header {
                        background-color: #f8f9fa;
                        border-bottom: 1px solid #ddd;
                        padding: 15px;
                    }
                    .card-body {
                        padding: 20px;
                    }
                    .img-center {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .buyButton {
                        width: 100%;
                    }
                    .text-center {
                        text-align: center;
                    }
                    .mt-4 {
                        margin-top: 1.5rem !important;
                    }
                `}</style>
            </div> 
        ) 
    } 
} 

export default Main;
