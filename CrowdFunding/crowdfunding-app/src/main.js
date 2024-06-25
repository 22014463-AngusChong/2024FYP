import React, { Component } from 'react'; 

class Main extends Component { 
    render() { 
        const { listOfFunds } = this.props; 
        
        return ( 
            <div className="container text-center"> 
                <h1 className="mt-4">Welcome!</h1> 
                <h4>Account: {this.props.account}</h4> 
                 
                <hr /> 
                <br /> 
                <div id="fundsRow" className="row"> 
                    {listOfFunds.map((fund, key) => {   
                        const goalInEther = window.web3.utils.fromWei(fund.goal.toString(), 'ether');
                        const donatedInEther = window.web3.utils.fromWei(fund.donated.toString(), 'ether');
                        const progress = (donatedInEther / goalInEther) * 100;
                        
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
                                        <strong>Campaign Goal</strong>: <span className="fund-goal">{goalInEther + " ETH"}</span><br /><br />
                                        <strong>Funds Donated</strong>: <span className="fund-donated">{donatedInEther + " ETH"}</span><br /><br /> 

                                        <strong>Donation Progress</strong>: <br />
                                        <progress value={progress} max="100" className="progress-bar"></progress><br /><br /> 

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
                                                    >Donate</button> 
                                                : <p>Thank you</p>                                       
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
                    .progress-bar {
                        width: 100%;
                        height: 20px;
                        -webkit-appearance: none;
                        appearance: none;
                    }
                    .progress-bar::-webkit-progress-bar {
                        background-color: #f3f3f3;
                        border-radius: 8px;
                        box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
                    }
                    .progress-bar::-webkit-progress-value {
                        background-color: #4caf50;
                        border-radius: 8px;
                    }
                    .progress-bar::-moz-progress-bar {
                        background-color: #4caf50;
                        border-radius: 8px;
                    }
                `}</style>
            </div> 
        ) 
    } 
} 

export default Main;

