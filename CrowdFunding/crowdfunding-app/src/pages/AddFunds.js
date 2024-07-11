import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class AddFunds extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  render() {
    const { message } = this.state;

    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center">
              <h2 className="text-primary">Start your fundraising journey now</h2>
              <p className="text-muted">Create a compelling campaign and start raising funds today.</p>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm p-4 bg-white rounded" style={{ width: '100%' }}>
                <h1 className="mb-4 text-center text-success">Create Your Campaign</h1>
                <p className="text-center text-muted">Total Campaigns: {this.props.fundsCount}</p>
                {message && (
                  <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                  </div>
                )}
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const name = this.fundsName.value;
                    const picName = this.fundsPic.value;
                    const goal = window.web3.utils.toWei(this.fundsGoal.value.toString(), 'ether');
                    const donated = window.web3.utils.toWei(this.fundsDonated.value.toString(), 'ether');
                    const desc = this.fundsDesc.value;

                    try {
                      await this.props.addFunds(name, picName, goal, donated, desc);
                      this.setState({ message: 'Campaign added successfully!' });
                    } catch (error) {
                      console.error('Error adding campaign:', error);
                      this.setState({ message: 'Error adding campaign, please try again.' });
                    }
                  }}
                >
                  <div className="form-group mb-3">
                    <label htmlFor="fundsName" className="form-label">Campaign Name</label>
                    <input
                      id="fundsName"
                      type="text"
                      ref={(input) => { this.fundsName = input }}
                      className="form-control"
                      placeholder="Enter your campaign name"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="fundsPic" className="form-label">Campaign Picture URL</label>
                    <input
                      id="fundsPic"
                      type="text"
                      ref={(input) => { this.fundsPic = input }}
                      className="form-control"
                      placeholder="Enter the picture URL for your campaign"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="fundsGoal" className="form-label">Campaign Goal (ETH)</label>
                    <input
                      id="fundsGoal"
                      type="text"
                      ref={(input) => { this.fundsGoal = input }}
                      className="form-control"
                      placeholder="Enter the fundraising goal for your campaign in ETH"
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="fundsDonated" className="form-label">Funds Donated (ETH)</label>
                    <input
                      id="fundsDonated"
                      type="text"
                      ref={(input) => { this.fundsDonated = input }}
                      className="form-control"
                      placeholder="Enter the amount already donated in ETH"
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="fundsDesc" className="form-label">Campaign Description</label>
                    <textarea
                      id="fundsDesc"
                      ref={(input) => { this.fundsDesc = input }}
                      className="form-control"
                      placeholder="Describe your campaign in detail"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-success btn-lg">Add Campaign</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddFunds;
