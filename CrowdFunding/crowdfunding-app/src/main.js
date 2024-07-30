import React, { Component } from 'react';
import Web3 from 'web3';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      username: '',
      newUsername: '',
      searchQuery: '',
      donationAmounts: {},
      comment: '',
      showModal: false,
      showDonationHistoryModal: false,
      showCommentsModal: false, 
      activeFundId: null,
      errorMessage: '',
      donationHistory: [],
      comments: [],
      selectedCategory: 'all',
      sortOrder: 'desc', // 'desc' for highest to lowest, 'asc' for lowest to highest
    };
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadAccount();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadAccount() {
    const accounts = await window.web3.eth.getAccounts();
    if (accounts.length > 0) {
      this.setState({ account: accounts[0] });
      this.loadUsername(accounts[0]);
    }
  }

  loadUsername(account) {
    const username = localStorage.getItem(`username_${account}`) || account;
    this.setState({ username });
  }

  handleUsernameChange = (event) => {
    this.setState({ newUsername: event.target.value });
  }

  saveUsername = () => {
    const { account, newUsername } = this.state;
    if (newUsername.trim()) {
      localStorage.setItem(`username_${account}`, newUsername);
      this.setState({ username: newUsername, newUsername: '' });
      alert('Username saved!');
    }
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleCategoryChange = (event) => {
    this.setState({ selectedCategory: event.target.value });
  }

  getOwnerName(ownerAddress) {
    const username = localStorage.getItem(`username_${ownerAddress}`);
    return username || ownerAddress;
  }

  handleDonationChange = (event) => {
    const { activeFundId } = this.state;
    const donationAmounts = { ...this.state.donationAmounts };
    donationAmounts[activeFundId] = event.target.value;
    this.setState({ donationAmounts, errorMessage: '' });
  }

  handleCommentChange = (event) => {
    this.setState({ comment: event.target.value });
  }

  handleDonate = () => {
    const { activeFundId, donationAmounts, comment } = this.state;
    const amount = parseFloat(donationAmounts[activeFundId]);

    if (amount <= 0) {
      this.setState({ errorMessage: 'Donation amount must be greater than zero.' });
      return;
    }

    const amountInWei = window.web3.utils.toWei(donationAmounts[activeFundId], 'ether');
    this.props.donateFund(activeFundId, amountInWei, comment);
    this.setState({ showModal: false, activeFundId: null, errorMessage: '', comment: '' });
  }

  handleShowModal = (fundId) => {
    this.setState({ showModal: true, activeFundId: fundId, errorMessage: '' });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false, activeFundId: null });
  }

  handleShowDonationHistory = async (fundId) => {
    try {
      const donationHistory = await this.props.getDonationHistory(fundId);
      this.setState({ showDonationHistoryModal: true, donationHistory, activeFundId: fundId });
    } catch (error) {
      console.error("Error fetching donation history:", error);
    }
  };

  handleCloseDonationHistoryModal = () => {
    this.setState({ showDonationHistoryModal: false, activeFundId: null });
  };

  handleShowComments = async (fundId) => {
    const comments = await this.props.getFundComments(fundId);
    this.setState({ showCommentsModal: true, comments, activeFundId: fundId });
  }

  handleCloseCommentsModal = () => {
    this.setState({ showCommentsModal: false, activeFundId: null });
  }

  handleSortOrderChange = (event) => {
    this.setState({ sortOrder: event.target.value }, this.sortDonations);
  }

  sortDonations = () => {
    const { donationHistory, sortOrder } = this.state;
    const sortedHistory = [...donationHistory].sort((a, b) => {
      const amountA = parseFloat(window.web3.utils.fromWei(a.amount, 'ether'));
      const amountB = parseFloat(window.web3.utils.fromWei(b.amount, 'ether'));
      return sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
    });
    this.setState({ donationHistory: sortedHistory });
  }

  filterFunds() {
    const { listOfFunds } = this.props;
    const { searchQuery, selectedCategory } = this.state;

    let filteredFunds = listOfFunds.filter(fund =>
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (selectedCategory) {
      case 'close-to-goal':
        filteredFunds = filteredFunds.filter(fund => {
          const goalInEther = parseFloat(window.web3.utils.fromWei(fund.goal.toString(), 'ether'));
          const donatedInEther = parseFloat(window.web3.utils.fromWei(fund.donated.toString(), 'ether'));
          return (donatedInEther / goalInEther) >= 0.60;
        });
        break;
      case 'just-launched':
        filteredFunds = filteredFunds.filter(fund => {
          const donatedInEther = parseFloat(window.web3.utils.fromWei(fund.donated.toString(), 'ether'));
          return donatedInEther === 0;
        });
        break;
      case 'needs-momentum':
        filteredFunds = filteredFunds.filter(fund => {
          const goalInEther = parseFloat(window.web3.utils.fromWei(fund.goal.toString(), 'ether'));
          const donatedInEther = parseFloat(window.web3.utils.fromWei(fund.donated.toString(), 'ether'));
          return donatedInEther > 0 && (donatedInEther / goalInEther) <= 0.5;
        });
        break;
      default:
        break;
    }

    return filteredFunds;
  }

  render() {
    const { account } = this.props;
    const { showModal, showDonationHistoryModal, showCommentsModal, activeFundId, donationAmounts, errorMessage, username, newUsername, searchQuery, donationHistory, comments, selectedCategory } = this.state;

    const filteredFunds = this.filterFunds();

    return (
      <div className="main-content">
        <div className="container">
          <div className="info">
            <span>Account: {account}</span>
            <span>Username: {username}</span>
          </div>
          <div className="username-input">
            <input
              type="text"
              value={newUsername}
              onChange={this.handleUsernameChange}
              placeholder="Enter new username"
            />
            <button className="btn save-username-btn" onClick={this.saveUsername}>Save Username</button>
          </div>
          <div className="search">
            <input
              type="text"
              value={searchQuery}
              onChange={this.handleSearchChange}
              placeholder="Search campaigns"
            />
          </div>
          <div className="category-dropdown">
            <select value={selectedCategory} onChange={this.handleCategoryChange}>
              <option value="all">All</option>
              <option value="close-to-goal">Close to goal</option>
              <option value="just-launched">Just launched</option>
              <option value="needs-momentum">Needs momentum</option>
            </select>
          </div>
          <div className="funds">
            {filteredFunds.map((fund, key) => {
              const goalInEther = fund.goal ? window.web3.utils.fromWei(fund.goal.toString(), 'ether') : '0';
              const donatedInEther = fund.donated ? window.web3.utils.fromWei(fund.donated.toString(), 'ether') : '0';
              const progress = (donatedInEther / goalInEther) * 100;

              return (
                <div key={key} className="fund-card">
                  <div className="fund-header">
                    <img src={fund.picName} alt={fund.name} />
                    <h2>{fund.name}</h2>
                  </div>
                  <div className="fund-body">
                    <p><strong>Description:</strong> {fund.desc}</p>
                    <p><strong>Campaign Owner:</strong> {this.getOwnerName(fund.ownerId)}</p>
                    <p><strong>Goal:</strong> {goalInEther} ETH</p>
                    <p><strong>Donated:</strong> {donatedInEther} ETH</p>
                    <p><strong>Status:</strong> {JSON.parse(fund.status) ? 'Ongoing' : 'Ended'}</p>
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                    {JSON.parse(fund.status) ?
                      <button
                        className="btn btn-primary buyButton"
                        onClick={() => this.handleShowModal(fund.fundId)}
                      >
                        Donate
                      </button>
                      : <p>Thank you</p>
                    }
                    <button className="btn donation-history-btn" onClick={() => this.handleShowDonationHistory(fund.fundId)}>Donation History</button>
                    <button className="btn comments-btn" onClick={() => this.handleShowComments(fund.fundId)}>Words of support</button>
                  </div>
                </div>
              )
            })}
          </div>
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
              <textarea
                placeholder="Leave a comment"
                value={this.state.comment}
                onChange={this.handleCommentChange}
              />
              {errorMessage && <p className="error">{errorMessage}</p>}
              <button className="btn donate-btn" onClick={this.handleDonate}>Donate</button>
            </div>
          </div>
        )}
        {
        showDonationHistoryModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={this.handleCloseDonationHistoryModal}>&times;</span>
              <h2>Donation History</h2>
              <select onChange={this.handleSortOrderChange} value={this.state.sortOrder}>
                <option value="desc">Highest to Lowest</option>
                <option value="asc">Lowest to Highest</option>
              </select>
              <ul className="donation-history">
                {donationHistory.map((donation, index) => (
                  <li key={index}>
                    <span>{this.getOwnerName(donation.donor)}</span>: <span>{window.web3.utils.fromWei(donation.amount, 'ether')} ETH</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
        {showCommentsModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={this.handleCloseCommentsModal}>&times;</span>
            <h2>Words of Support</h2>
            <ul className="comments">
              {comments.map((comment, index) => (
                <li key={index} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-profile">
                      <img src="/icon.png" alt="Profile Icon" className="profile-icon" />
                      <div>
                        <span className="comment-name">{this.getOwnerName(comment.donor)}</span>
                        <div className="comment-meta">
                          <span className="comment-amount">{window.web3.utils.fromWei(comment.amount, 'ether')} ETH</span>
                          <span className="comment-text">{comment.comment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

        <style jsx>{`
          body, html {
            height: 100%;
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .main-content {
            min-height: 100vh;
            background-image: url('/wallpaper.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding-top: 50px;
          }
          .info {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            font-size: 1.4em;
          }
          .info span {
            margin-bottom: 10px;
          }
          .username-input, .search, .category-dropdown {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          .username-input input, .search input, .category-dropdown select {
            margin-right: 10px;
            font-size: 1.1em;
            width: 250px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .funds {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .fund-card {
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            width: 590px;
            transition: box-shadow 0.3s ease;
          }
          .fund-card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
          .fund-header img {
            width: 100%;
            height: auto;
            border-radius: 5px;
          }
          .fund-header h2 {
            margin: 10px 0;
            font-size: 1.5em;
            text-align: center;
            color: #333;
          }
          .fund-body {
            padding: 10px 0;
            flex-grow: 1;
            font-size: 1.1em;
            color: #555;
          }
          .fund-body p {
            margin: 0 0 10px;
          }
          .progress-bar {
            background: #e9e9e9;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
          }
          .progress-bar .progress {
            height: 10px;
            background: #4caf50;
          }
          .btn {
            cursor: pointer;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 1.1em;
            font-weight: 600;
            transition: background-color 0.3s ease;
          }
          .save-username-btn {
            background-color: #007bff;
            color: white;
          }
          .save-username-btn:hover {
            background-color: #0056b3;
          }
          .donate-btn {
            background-color: #28a745;
            color: white;
          }
          .donate-btn:hover {
            background-color: #218838;
          }
          .donation-history-btn {
            background-color: #17a2b8;
            color: white;
            margin-left: 10px;
          }
          .donation-history-btn:hover {
            background-color: #117a8b;
          }
          .comments-btn {
            background-color: #6c757d;
            color: white;
            margin-left: 10px;
          }
          .comments-btn:hover {
            background-color: #5a6268;
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
            background-color: rgba(0,0,0,0.4);
          }
          .modal-content {
            background-color: #fff;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 590px;
            text-align: center;
            border-radius: 8px;
            font-size: 1.2em;
          }
          .modal-content input[type="text"], .modal-content textarea {
            margin-bottom: 20px;
            padding: 10px;
            font-size: 1em;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
          }

          .modal-content .btn.donate-btn {
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 600;
          }

          .modal-content .btn.donate-btn:hover {
            background-color: #218838;
          }
          .close {
            color: #aaa;
            float: right;
            font-size: 1.5em;
            font-weight: bold;
          }
          .close:hover, .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
          .error {
            color: red;
          }
          .donation-history, .comments {
            list-style: none;
            padding: 0;
            margin: 20px 0;
          }
          .donation-history li, .comments li {
            margin-bottom: 10px;
            font-size: 1.1em;
          }
          .comments {
            list-style: none;
            padding: 0;
            margin: 20px 0;
          }

          .comment-item {
            border-bottom: 1px solid #e0e0e0;
            padding: 15px 0;
          }

          .comment-header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .comment-profile {
            display: flex;
            align-items: flex-start;
          }

          .profile-icon {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            display: inline-block;
          }

          .comment-name {
            font-weight: bold;
            margin-left: 0px;
          }

          .comment-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            color: #757575;
            font-size: 0.9em;
          }

          .comment-amount {
            margin-bottom: 5px;
          }

          .comment-text {
            margin: 0;
            font-size: 1em;
          }


        `}</style>
      </div>
    );
  }
}

export default Main;
