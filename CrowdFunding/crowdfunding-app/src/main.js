import React, { Component } from 'react';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            donationAmounts: {},
            showModal: false,
            activeFundId: null,
            errorMessage: ''
        };
    }

    handleDonationChange = (event) => {
        const { activeFundId } = this.state;
        const donationAmounts = { ...this.state.donationAmounts };
        donationAmounts[activeFundId] = event.target.value;
        this.setState({ donationAmounts, errorMessage: '' });
    }

    handleDonate = () => {
        const { activeFundId, donationAmounts } = this.state;
        const amount = parseFloat(donationAmounts[activeFundId]);

        if (amount <= 0) {
            this.setState({ errorMessage: 'Donation amount must be greater than zero.' });
            return;
        }

        const amountInWei = window.web3.utils.toWei(donationAmounts[activeFundId], 'ether');
        this.props.donateFund(activeFundId, amountInWei);
        this.setState({ showModal: false, activeFundId: null, errorMessage: '' });
    }

    handleShowModal = (fundId) => {
        this.setState({ showModal: true, activeFundId: fundId, errorMessage: '' });
    }

    handleCloseModal = () => {
        this.setState({ showModal: false, activeFundId: null, errorMessage: '' });
    }

    render() {
        const { listOfFunds, account } = this.props;
        const { showModal, activeFundId, donationAmounts, errorMessage } = this.state;

        return (
            <div className="container-fluid text-center main-container">
                <h1 className="mt-4">Welcome!</h1>
                <h4>Account: {account}</h4>

                <hr />
                <br />
                <div id="fundsRow" className="row">
                    {listOfFunds.map((fund, key) => {
                        const goalInEther = fund.goal ? window.web3.utils.fromWei(fund.goal.toString(), 'ether') : '0';
                        const donatedInEther = fund.donated ? window.web3.utils.fromWei(fund.donated.toString(), 'ether') : '0';
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
                                        <strong>Campaign Owner</strong>: <span className="fund-owner">{fund.ownerId}</span><br /><br />
                                        <strong>Campaign Description</strong>: <span className="fund-owner">{fund.desc}</span><br /><br />
                                        <strong>Campaign Status</strong>: <span className="fund-status">{JSON.parse(fund.status) ? 'Ongoing' : 'Ended'}</span><br /><br />
                                        <strong>Campaign Goal</strong>: <span className="fund-goal">{goalInEther + " ETH"}</span><br /><br />
                                        <strong>Funds Donated</strong>: <span className="fund-donated">{donatedInEther + " ETH"}</span><br /><br />
                                        <strong>Donation Progress</strong>: <br />
                                        <progress value={progress} max="100" className="progress-bar"></progress><br />
                                        <strong>
                                            {JSON.parse(fund.status) ?
                                                <button
                                                    className="btn btn-primary buyButton"
                                                    onClick={() => this.handleShowModal(fund.fundId)}
                                                >
                                                    Donate
                                                </button>
                                                : <p>Thank you</p>
                                            }
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={this.handleCloseModal}>&times;</span>
                            <h2>Enter Donation Amount</h2>
                            <input
                                type="text"
                                placeholder="Enter donation amount"
                                value={donationAmounts[activeFundId] || ''}
                                onChange={this.handleDonationChange}
                            />
                            {errorMessage && <p className="error">{errorMessage}</p>}
                            <button className="btn btn-primary" onClick={this.handleDonate}>Donate</button>
                        </div>
                    </div>
                )}
                <style jsx>{`
                    .main-container {
                        margin-top: 1px; /* Adjust based on the height of your navbar */
                        min-height: calc(120vh - 50px);
                        background-image: url('/wallpaper.png');
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        padding: 20px;
                    }
                    h1, h2, h4 {
                        margin-bottom: 20px;
                    }
                    .card {
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        background-color: rgba(255, 255, 255, 0.8);
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
                    .modal {
                        display: block;
                        position: fixed;
                        z-index: 1;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        background-color: rgb(0,0,0);
                        background-color: rgba(0,0,0,0.4);
                    }
                    .modal-content {
                        background-color: #fefefe;
                        margin: 15% auto;
                        padding: 20px;
                        border: 1px solid #888;
                        width: 80%;
                        max-width: 500px;
                        text-align: center;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .close {
                        color: #aaa;
                        float: right;
                        font-size: 28px;
                        font-weight: bold;
                    }
                    .close:hover,
                    .close:focus {
                        color: black;
                        text-decoration: none;
                        cursor: pointer;
                    }
                    .btn {
                        margin-top: 10px;
                    }
                    .error {
                        color: red;
                        margin-top: 10px;
                    }
                `}</style>
            </div>
        )
    }
}

export default Main;



